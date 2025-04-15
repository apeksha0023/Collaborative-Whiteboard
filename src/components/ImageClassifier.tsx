import { useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';

function ImageClassifier() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    // Mock ML prediction
    setResult('Classifying...');
    setTimeout(() => {
      setResult('Predicted class: KNOWN..');
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="p-4">
      <Form>
        <Form.Group controlId="imageUpload">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        {previewUrl && (
          <div className="my-3">
            <Image src={previewUrl} alt="Preview" fluid rounded />
          </div>
        )}

        <Button onClick={handleUpload} className="mt-2">Classify</Button>

        {result && <p className="mt-3 fw-bold">{result}</p>}
      </Form>
    </div>
  );
}

export default ImageClassifier;

