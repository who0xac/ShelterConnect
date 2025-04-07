# ShelterConnect 🏡

<div align="center">
  
  **Bridging the gap between resources and those who need them most.**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![UK Government Backed](https://img.shields.io/badge/UK%20Government-Backed-green)](https://www.gov.uk/)
  [![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red)](https://github.com/GarudaR007X/shelterconnect)
  
</div>

## 📋 Overview

**ShelterConnect** is a comprehensive digital platform backed by the UK Government, designed to support vulnerable individuals experiencing homelessness or recovering from addiction. The system streamlines shelter provision, rehabilitation resource allocation, and operational management through an intuitive, unified interface.

## 🌟 Mission

> Transforming lives by connecting vulnerable individuals with the resources, housing, and support networks they need to rebuild their futures.

## 🏗️ Technology Stack

<table>
  <tr>
    <td align="center"><b>Frontend</b></td>
    <td>
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
      <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" alt="Vue.js">
      <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white" alt="Material UI">
    </td>
  </tr>
  <tr>
    <td align="center"><b>Backend</b></td>
    <td>
      <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
      <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js">
    </td>
  </tr>
  <tr>
    <td align="center"><b>Database</b></td>
    <td>
      <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    </td>
  </tr>
  <tr>
    <td align="center"><b>Auth</b></td>
    <td>
      <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
      <img src="https://img.shields.io/badge/OAuth-2.0-blue?style=for-the-badge" alt="OAuth">
    </td>
  </tr>
  <tr>
    <td align="center"><b>Deployment</b></td>
    <td>
      <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS">
    </td>
  </tr>
</table>

## 👥 User Roles & Hierarchy

### 1. Admin 👑
- System-wide access and control
- Manages all entities (Staff, RSLs, MAs, Properties)
- Oversees RSL and MA assignments

### 2. Managing Agent (MA) 🏢
- Access restricted to assigned RSLs
- Manages properties under their RSLs
- Assigns and oversees staff
- Monitors tenant placements

### 3. Staff 👨‍💼👩‍💼
- Property and tenant management within assigned scope
- Configurable permissions
- Direct tenant interaction and support

## 🔑 Key Features

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <div style="flex: 1; min-width: 300px; padding: 15px; border-radius: 8px; background-color: #f5f5f5;">
    <h3>🔐 Secure Authentication</h3>
    <p>Role-based access control with JWT/OAuth integration</p>
  </div>
  <div style="flex: 1; min-width: 300px; padding: 15px; border-radius: 8px; background-color: #f5f5f5;">
    <h3>🏠 Property Management</h3>
    <p>Comprehensive tracking of properties, rooms, and occupancy</p>
  </div>
  <div style="flex: 1; min-width: 300px; padding: 15px; border-radius: 8px; background-color: #f5f5f5;">
    <h3>👥 Tenant Lifecycle</h3>
    <p>Onboarding, rehab tracking, document management</p>
  </div>
  <div style="flex: 1; min-width: 300px; padding: 15px; border-radius: 8px; background-color: #f5f5f5;">
    <h3>📊 Analytics Dashboard</h3>
    <p>Insights into program effectiveness and resource utilization</p>
  </div>
  <div style="flex: 1; min-width: 300px; padding: 15px; border-radius: 8px; background-color: #f5f5f5;">
    <h3>🔔 Notifications</h3>
    <p>Real-time alerts for important events and updates</p>
  </div>
</div>

## 📦 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/who0xac/shelterconnect.git
   cd shelterconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔮 Future Roadmap

| Feature | Priority | Status |
|---------|----------|--------|
| 📱 Mobile App (React Native) | High | Planning |
| 🌐 Multi-language Support | Medium | Researching |
| 📍 Location-based Services | Medium | Conceptual |
| ⚖️ Compliance Audit Trails | High | Designing |
| 📈 Performance Dashboards | High | Prototyping |
| 🧠 AI Matching Algorithm | Low | Researching |
| 🧩 Granular Permissions | Medium | Planning |

## 🤝 Contributing

We welcome contributions to ShelterConnect! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code adheres to our style guidelines and passes all tests.



<div align="center">
  <p><b>ShelterConnect</b> — Building bridges to better lives</p>
  <p>Made with ❤️ by <a href="https://github.com/who0xac">who0xac</a></p>
</div>
