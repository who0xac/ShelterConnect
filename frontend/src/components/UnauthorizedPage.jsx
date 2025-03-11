import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";

// Global styles with enhanced typography and resets
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    overflow-x: hidden;
    color: #333;
  }
`;

// Enhanced animations collection
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-3deg); }
  75% { transform: translateY(8px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Background effect components
const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 0;
  opacity: 0.6;
  animation: ${pulse} 7s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #080c24;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 30px 30px;
  opacity: 0.3;
  z-index: 1;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.8rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 -10px 20px -5px rgba(0, 0, 0, 0.1) inset;
  max-width: 500px;
  width: 92%;
  animation: ${fadeIn} 0.9s ease-out;
  position: relative;
  z-index: 10;
  transform: perspective(1000px) rotateX(0deg);
  transition: all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);

  &:hover {
    transform: perspective(1000px) rotateX(2deg) translateY(-5px);
    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset,
      0 -10px 20px -5px rgba(0, 0, 0, 0.1) inset;
  }
`;

const IconContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
`;

// IconGlow component is removed

const IconRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110px;
  height: 110px;
  border: 2px solid rgba(255, 75, 43, 0.3);
  border-radius: 50%;
  animation: ${rotate} 10s linear infinite;

  &:before {
    content: "";
    position: absolute;
    top: -5px;
    left: 50px;
    width: 10px;
    height: 10px;
    background: #ff4b2b;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 75, 43, 0.5);
  }
`;

const LockIconWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 5s ease-in-out infinite;
`;

const LockIcon = styled.div`
  font-size: 5rem;
  color: #ff4b2b;
  filter: drop-shadow(0 4px 6px rgba(255, 75, 43, 0.3));
`;

const CardAccent = styled.div`
  position: absolute;
  top: -5px;
  left: 10%;
  right: 10%;
  height: 5px;
  background: linear-gradient(90deg, #ff4b2b, #ff416c, #ff416c, #ff4b2b);
  background-size: 200% 200%;
  animation: ${shimmer} 3s linear infinite;
  border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  margin-bottom: 1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
  letter-spacing: -0.5px;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 2.2rem;
  line-height: 1.7;
  animation: ${fadeIn} 0.8s ease-out 0.4s both;
`;

const ButtonContainer = styled.div`
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 15px;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    opacity: 0.3;
    transition: all 0.3s ease;
  }

  &:hover:after {
    opacity: 0.5;
    width: 90%;
  }
`;

const Button = styled.button`
  padding: 14px 32px;
  font-size: 1rem;
  background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(255, 75, 43, 0.3);
  position: relative;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg) translateY(-100%);
    transition: transform 0.7s;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(255, 75, 43, 0.4);

    &:after {
      transform: rotate(45deg) translateY(100%);
    }
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(255, 75, 43, 0.3);
  }

  & > svg,
  & > span {
    position: relative;
    z-index: 2;
  }
`;

const ButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorCode = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  letter-spacing: 2px;
  z-index: 5;
  animation: ${fadeIn} 0.8s ease-out 0.8s both;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
`;

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [orbs, setOrbs] = useState([]);

  // Generate background orbs
  useEffect(() => {
    const newOrbs = [
      {
        id: 1,
        top: "20%",
        left: "15%",
        size: "250px",
        color: "rgba(255, 75, 43, 0.3)",
        delay: "0s",
      },
      {
        id: 2,
        top: "60%",
        left: "80%",
        size: "300px",
        color: "rgba(255, 65, 108, 0.3)",
        delay: "2s",
      },
      {
        id: 3,
        top: "75%",
        left: "30%",
        size: "200px",
        color: "rgba(40, 48, 105, 0.3)",
        delay: "4s",
      },
    ];

    setOrbs(newOrbs);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const card = containerRef.current.querySelector('div[class*="Card"]');
      const lockIcon = containerRef.current.querySelector(
        'div[class*="LockIconWrapper"]'
      );

      if (!card || !lockIcon) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const moveX = (e.clientX - centerX) / 30;
      const moveY = (e.clientY - centerY) / 30;

      // Apply subtle movement to card
      card.style.transform = `perspective(1000px) rotateY(${
        moveX * 0.5
      }deg) rotateX(${-moveY * 0.5}deg)`;

      // Apply more pronounced movement to icon
      lockIcon.style.transform = `translateX(${moveX * 2}px) translateY(${
        moveY * 2
      }px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container ref={containerRef}>
        <ErrorCode>ERROR 403</ErrorCode>
        <BackgroundPattern />

        {/* Background orbs */}
        {orbs.map((orb) => (
          <Orb
            key={orb.id}
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              backgroundColor: orb.color,
            }}
            delay={orb.delay}
          />
        ))}

        <Card>
          <CardAccent />
          <IconContainer>
            {/* IconGlow component is removed from here */}
            <IconRing />
            <LockIconWrapper>
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
            </LockIconWrapper>
          </IconContainer>

          <Title>Access Restricted</Title>

          <Message>
            You don't have permission to access this area. Please contact your
            administrator if you believe this is an error.
          </Message>

          <ButtonContainer>
            <Button onClick={() => navigate("/dashboard")}>
              <ButtonIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              </ButtonIcon>
              <span>Return to Dashboard</span>
            </Button>
          </ButtonContainer>
        </Card>
      </Container>
    </>
  );
};

export default UnauthorizedPage;