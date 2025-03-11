import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Animation for floating effect
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
  text-align: center;
`;

const LockIcon = styled.div`
  font-size: 8rem;
  color: #dc3545;
  animation: ${float} 3s ease-in-out infinite;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #212529;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 12px 30px;
  font-size: 1.1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
  }
`;

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LockIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: "100%", height: "100%" }}
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </LockIcon>

      <Title>Access Restricted 🔒</Title>

      <Message>
        Oops! It seems you don't have permission to view this page. Please
        contact your administrator if you believe this is an error.
      </Message>

      <Button onClick={() => navigate("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Return to Home
      </Button>
    </Container>
  );
};

export default UnauthorizedPage;
