
import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { socket } from '../socket';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import ImageClassifier from './ImageClassifier'; // Adjust the path if needed

function Whiteboard() {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);

  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new fabric.Canvas(canvasEl.current, {
      isDrawingMode: true,
      width: window.innerWidth * 0.65, // 65% width for drawing area
      height: window.innerHeight - 180,
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;

    const handlePathCreated = () => {
      const json = canvas.toJSON();
      const updatedHistory = [...historyRef.current.slice(0, historyIndexRef.current + 1), JSON.stringify(json)];
      historyRef.current = updatedHistory;
      historyIndexRef.current = updatedHistory.length - 1;
      socket.emit('canvas-data', json);
    };

    canvas.on('path:created', handlePathCreated);

    const handleSocketData = (json: any) => {
      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
      });
    };

    socket.on('canvas-data', handleSocketData);

    canvasRef.current = canvas;

    return () => {
      canvas.off('path:created', handlePathCreated);
      socket.off('canvas-data', handleSocketData);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.freeDrawingBrush.color = color;
    }
  }, [color]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize]);

  const handleUndo = () => {
    if (historyIndexRef.current > 0 && canvasRef.current) {
      historyIndexRef.current -= 1;
      canvasRef.current.loadFromJSON(
        JSON.parse(historyRef.current[historyIndexRef.current]),
        () => canvasRef.current?.renderAll()
      );
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1 && canvasRef.current) {
      historyIndexRef.current += 1;
      canvasRef.current.loadFromJSON(
        JSON.parse(historyRef.current[historyIndexRef.current]),
        () => canvasRef.current?.renderAll()
      );
    }
  };

  const handleSaveAsImage = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL({ format: 'png' });
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'whiteboard.png';
      a.click();
    }
  };

  return (
    <div className="container py-4">
      <Row className="mb-4">
        <Col md={8} className="border-end">
          <h4 className="mb-3">Whiteboard</h4>
          <Row className="mb-2">
            <Col xs="auto">
              <Form.Label>Brush Color</Form.Label>
              <Form.Control type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </Col>
            <Col xs="auto">
              <Form.Label>Brush Size</Form.Label>
              <Form.Range min={1} max={50} value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} />
            </Col>
            <Col xs="auto" className="d-flex align-items-end">
              <Button variant="secondary" onClick={handleUndo} className="me-2">Undo</Button>
              <Button variant="secondary" onClick={handleRedo} className="me-2">Redo</Button>
              <Button variant="success" onClick={handleSaveAsImage}>Save as PNG</Button>
            </Col>
          </Row>

          <div className="border bg-white">
            <canvas ref={canvasEl} style={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
          </div>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Header>
              <h5>Image Classifier</h5>
            </Card.Header>
            <Card.Body className="p-3">
              <ImageClassifier />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Whiteboard;
