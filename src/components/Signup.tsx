// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Button, Form } from 'react-bootstrap';
// import { useState } from 'react';

// const Signup = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignup = () => {
//     if (email && password) {
//       login();
//       navigate('/login');
//     }
//   };

//   return (
//     <div className="p-4 w-50 mx-auto">
//       <h3>Signup</h3>
//       <Form>
//         <Form.Group>
//           <Form.Label>Email</Form.Label>
//           <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         </Form.Group>
//         <Form.Group>
//           <Form.Label>Password</Form.Label>
//           <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </Form.Group>
//         <Button className="mt-2" onClick={handleSignup}>Signup</Button>
//       </Form>
//     </div>
//   );
// };
// export default Signup;








import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Form, Card } from 'react-bootstrap';
import { useState } from 'react';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (email && password) {
      login();
      navigate('/login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4">
        <Card.Body>
          <h3 className="text-center mb-4">Signup</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" className="w-100" onClick={handleSignup}>
              Signup
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;
