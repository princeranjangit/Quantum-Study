import {
  Announcement,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizAttempt,
  StudyMaterial,
  Subject,
  UserProfile,
  UserProgress,
} from '../types/lms';

const NOW = '2026-11-18T09:30:00.000Z';

export const DEMO_STUDENT_PROFILE: UserProfile = {
  uid: 'demo-student-aarav',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@quantumuniversity.edu.in',
  universityName: 'Quantum University, Roorkee',
  course: 'B.Tech',
  branch: 'Computer Science & Engineering',
  semester: 5,
  studentId: 'QU22BTCSE042',
  role: 'student',
  avatarUrl: '/src/assets/images/avatar_student_default_1795536853305.jpg',
  createdAt: '2026-08-01T08:00:00.000Z',
  updatedAt: NOW,
};

export const DEMO_ADMIN_PROFILE: UserProfile = {
  uid: 'demo-admin-vikram',
  fullName: 'Dr. Vikram Mehta',
  email: 'admin@quantumuniversity.edu.in',
  universityName: 'Quantum University, Roorkee',
  course: 'Faculty of Technology',
  branch: 'Computer Science & Engineering',
  semester: 5,
  studentId: 'QUFAC018',
  role: 'admin',
  avatarUrl: '/src/assets/images/avatar_student_default_1795536853305.jpg',
  createdAt: '2026-07-15T08:00:00.000Z',
  updatedAt: NOW,
};

export const INITIAL_USERS: UserProfile[] = [
  DEMO_STUDENT_PROFILE,
  {
    uid: 'demo-student-priya',
    fullName: 'Priya Rawat',
    email: 'priya.rawat@quantumuniversity.edu.in',
    universityName: 'Quantum University, Roorkee',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: 5,
    studentId: 'QU22BTCSE057',
    role: 'student',
    createdAt: '2026-08-03T10:15:00.000Z',
    updatedAt: NOW,
  },
  {
    uid: 'demo-student-rohan',
    fullName: 'Rohan Bisht',
    email: 'rohan.bisht@quantumuniversity.edu.in',
    universityName: 'Quantum University, Roorkee',
    course: 'B.Tech',
    branch: 'Information Technology',
    semester: 5,
    studentId: 'QU22BTIT019',
    role: 'student',
    createdAt: '2026-08-05T11:20:00.000Z',
    updatedAt: NOW,
  },
  DEMO_ADMIN_PROFILE,
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-web-dev',
    code: 'CS501',
    name: 'Web Development',
    semester: 5,
    branch: 'Computer Science & Engineering',
    credits: 4,
    instructor: 'Prof. Ananya Verma',
    description:
      'Foundations of Internet protocols, HTML/CSS/DHTML, XML processors, SOAP/REST Web Services, AJAX, Web 2.0/3.0 semantic architectures, and AI-driven Web 4.0 systems.',
    coverImage: '/src/assets/images/subject_web_dev_1795536852976.jpg',
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: NOW,
    units: [
      {
        unitNumber: 1,
        title: 'Internet Foundations, HTML & Core Web Protocols',
        durationHours: 7,
        topics: [
          'History of the Internet',
          'World Wide Web',
          'HTML',
          'Protocols – HTTP, SMTP',
          'Protocols – POP3, MIME, IMAP',
          'Domain Name Server',
          'Web Browsers',
          'Web Servers',
        ],
      },
      {
        unitNumber: 2,
        title: 'Structured Markup, Dynamic HTML & XML Processing',
        durationHours: 8,
        topics: [
          'Lists',
          'Tables',
          'Images',
          'Forms',
          'Frames',
          'Dynamic HTML with JavaScript',
          'CSS Document Type Definition',
          'Dynamic HTML',
          'XML',
          'Schema',
          'Object Models',
          'Presenting XML',
          'XML Using XML Processors: DOM and SAX',
        ],
      },
      {
        unitNumber: 3,
        title: 'Web Services Architecture, AJAX & Distributed Objects',
        durationHours: 7,
        topics: [
          'Introduction to Web Services',
          'UDDI',
          'SOAP',
          'WSDL',
          'Web Service',
          'Architecture of Web Services',
          'Developing and Deploying Web Services',
          'Ajax – Improving Web Page Performance Using Ajax',
          'Programming in Ajax',
          'CORBA',
        ],
      },
      {
        unitNumber: 4,
        title: 'Web 2.0, Semantic Web 3.0 & Modern Web Systems',
        durationHours: 7,
        topics: [
          'Web 2.0',
          'Interactive and Social Web',
          'Blogs',
          'Wikis',
          'Social Networking Sites',
          'Technologies Behind Web 2.0',
          'AJAX',
          'RSS',
          'Ruby on Rails',
          'Open APIs',
          'Web 3.0',
          'Semantic Web',
          'Widgets',
          'Mashups',
          'RDF',
          'Web-Based Information Systems',
          'Search Engines',
          'Recommender Systems',
          'Benefits of Blockchain',
          'Edge Computing',
          'Dark Mode in Web Development',
        ],
      },
      {
        unitNumber: 5,
        title: 'Web 4.0, AI-Powered Interfaces & Future Technologies',
        durationHours: 7,
        topics: [
          'Web 4.0',
          'AI-Powered Web and Personalized Content',
          'Decentralized Web (DWeb) and Blockchain Integration',
          'Blockchain Integration',
          'Internet of Things (IoT) in Web Development',
          'Augmented Reality (AR) and Virtual Reality (VR) in Web',
          'Smart Web',
          'Adaptive Interfaces',
          'Web Automation',
          'Impact of 5G on Web Technologies',
        ],
      },
    ],
  },
  {
    id: 'subj-dsa',
    code: 'CS502',
    name: 'Design & Analysis of Algorithms',
    semester: 5,
    branch: 'Computer Science & Engineering',
    credits: 4,
    instructor: 'Dr. Rajeev Joshi',
    description:
      'Asymptotic analysis, divide-and-conquer, greedy strategies, dynamic programming, graph traversals, and NP-completeness proofs for engineering problem solving.',
    coverImage: '/src/assets/images/subject_data_structures_1795536852690.jpg',
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: NOW,
    units: [
      {
        unitNumber: 1,
        title: 'Asymptotic Notation & Recurrence Relations',
        durationHours: 7,
        topics: ['Big-O, Omega, Theta Notations', 'Master Theorem', 'Recursion Trees', 'Amortized Analysis'],
      },
      {
        unitNumber: 2,
        title: 'Divide and Conquer & Sorting Bounds',
        durationHours: 8,
        topics: ['Merge Sort', 'Quick Sort Analysis', 'Strassen Matrix Multiplication', 'Order Statistics'],
      },
      {
        unitNumber: 3,
        title: 'Greedy Method & Dynamic Programming',
        durationHours: 8,
        topics: ['Huffman Coding', 'Minimum Spanning Trees', '0/1 Knapsack', 'Longest Common Subsequence'],
      },
      {
        unitNumber: 4,
        title: 'Graph Algorithms & Shortest Paths',
        durationHours: 7,
        topics: ['BFS & DFS', 'Dijkstra Algorithm', 'Bellman-Ford', 'Floyd-Warshall All-Pairs Shortest Path'],
      },
      {
        unitNumber: 5,
        title: 'Backtracking, Branch & Bound & NP-Completeness',
        durationHours: 6,
        topics: ['N-Queens Problem', 'Travelling Salesperson', 'Class P and NP', 'Polynomial Reductions'],
      },
    ],
  },
  {
    id: 'subj-dbms',
    code: 'CS503',
    name: 'Database Management Systems',
    semester: 5,
    branch: 'Computer Science & Engineering',
    credits: 4,
    instructor: 'Prof. Neha Kulkarni',
    description:
      'ER modeling, relational algebra, SQL query optimization, B+ tree indexing, ACID transactions, and concurrency control protocols.',
    coverImage: '/src/assets/images/subject_dbms_1795536852240.jpg',
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: NOW,
    units: [
      {
        unitNumber: 1,
        title: 'Database Architecture & ER Modeling',
        durationHours: 7,
        topics: ['Three-Schema Architecture', 'ER Diagrams', 'Weak Entities', 'Generalization & Specialization'],
      },
      {
        unitNumber: 2,
        title: 'Relational Model & SQL Mastery',
        durationHours: 8,
        topics: ['Relational Algebra', 'Tuple Calculus', 'DDL & DML Queries', 'Joins, Views & Triggers'],
      },
      {
        unitNumber: 3,
        title: 'Normalization & Functional Dependencies',
        durationHours: 7,
        topics: ['Armstrong Axioms', '1NF, 2NF, 3NF', 'BCNF Decomposition', 'Lossless Join Property'],
      },
      {
        unitNumber: 4,
        title: 'Indexing, Hashing & Query Optimization',
        durationHours: 7,
        topics: ['B-Trees & B+ Trees', 'Static & Dynamic Hashing', 'Cost-Based Optimization', 'Execution Plans'],
      },
      {
        unitNumber: 5,
        title: 'Transaction Processing & Concurrency Control',
        durationHours: 7,
        topics: ['ACID Properties', 'Conflict Serializability', 'Two-Phase Locking (2PL)', 'Deadlock Prevention'],
      },
    ],
  },
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-web-u1-notes',
    title: 'Unit 1 Complete Notes: Internet Architecture, HTTP, SMTP & DNS',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 1,
    category: 'Lecture Notes',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    uploadDate: '2026-11-04',
    uploadedBy: 'Prof. Ananya Verma',
    description: 'Comprehensive lecture notes covering ARPANET origins, WWW architecture, HTTP request/response headers, SMTP/POP3/IMAP mail protocols, MIME encoding, and DNS resolution.',
    createdAt: '2026-11-04T10:00:00.000Z',
    previewContent: `# Web Development (CS501) — Unit 1 Lecture Notes
## Internet Foundations, HTML & Core Web Protocols

### 1. History of the Internet & World Wide Web
- 1969: ARPANET connects UCLA, Stanford, UCSB, and Utah using packet switching.
- 1983: TCP/IP adopted as standard protocol suite.
- 1989–1991: Tim Berners-Lee invents the World Wide Web (HTML, HTTP, URL) at CERN.

### 2. Core Application Layer Protocols
- **HTTP (Hypertext Transfer Protocol)**: Stateless request-response protocol on TCP port 80 (HTTPS on 443). Methods: GET, POST, PUT, DELETE, PATCH.
- **SMTP (Simple Mail Transfer Protocol)**: Push protocol on port 25/587 used to send email from client to server and between mail servers.
- **POP3 (Post Office Protocol v3)**: Pull protocol on port 110; typically downloads messages locally and deletes from server.
- **IMAP (Internet Message Access Protocol)**: Port 143/993; keeps messages synchronized on the mail server across multiple devices.
- **MIME (Multipurpose Internet Mail Extensions)**: Extends email format to support attachments, images, audio, and non-ASCII character sets.

### 3. Domain Name Server (DNS)
Hierarchical distributed naming system translating human-readable domains (e.g., quantumuniversity.edu.in) into IPv4/IPv6 addresses via Recursive Resolvers, Root Servers, TLD Servers, and Authoritative Name Servers.

### 4. Web Browsers & Web Servers
Browsers (Rendering engine + JS engine + Networking) parse HTML into DOM and CSS into CSSOM. Web Servers (Apache, Nginx) listen on sockets, serve static assets, or proxy dynamic requests.`,
  },
  {
    id: 'mat-web-u2-xml',
    title: 'Unit 2 PDF Notes: DHTML, CSS DTD, XML Schema, DOM vs SAX Parsers',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 2,
    category: 'PDF Notes',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    uploadDate: '2026-11-07',
    uploadedBy: 'Prof. Ananya Verma',
    description: 'Detailed guide to HTML forms/tables, JavaScript DOM manipulation, DTD vs XSD schemas, XSLT transformations, and memory-tradeoff comparison between DOM and SAX XML processors.',
    createdAt: '2026-11-07T11:30:00.000Z',
    previewContent: `# Web Development (CS501) — Unit 2 PDF Notes
## Structured Markup, Dynamic HTML & XML Processing

### 1. HTML Structural Elements & Forms
Semantic tables (\`<thead>\`, \`<tbody>\`, \`<th>\`), nested ordered/unordered lists, responsive images, and accessible \`<form>\` controls with GET/POST methods and client/server validation.

### 2. Dynamic HTML (DHTML)
DHTML combines HTML + CSS + JavaScript + DOM to dynamically mutate style, position, and document content in real time without full page reloads.

### 3. XML, DTD & XML Schema (XSD)
- **DTD (Document Type Definition)**: Compact syntax defining legal building blocks, lacks rich data types and namespace support.
- **XML Schema (XSD)**: Written in XML syntax, supports strict primitive data types (\`xs:integer\`, \`xs:date\`), occurrence constraints, and namespaces.

### 4. XML Processors: DOM vs SAX
| Feature | DOM (Document Object Model) | SAX (Simple API for XML) |
| --- | --- | --- |
| Parsing Model | Tree-based in-memory | Event-driven streaming |
| Memory Usage | High (loads entire tree) | Very low (constant memory) |
| Random Access | Yes (bidirectional navigation) | No (sequential read-only) |
| Best Use Case | Small/medium config & editing | Large XML feeds & log streams |`,
  },
  {
    id: 'mat-web-u3-ws',
    title: 'Unit 3 Study Material: SOAP, WSDL, UDDI, AJAX & CORBA Architecture',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 3,
    category: 'Unit-wise Study Material',
    fileType: 'PPTX',
    fileSize: '4.2 MB',
    uploadDate: '2026-11-10',
    uploadedBy: 'Prof. Ananya Verma',
    description: 'Architecture diagrams and XML examples for SOAP envelopes, WSDL service contracts, UDDI registries, asynchronous XMLHttpRequest programming, and CORBA ORB middleware.',
    createdAt: '2026-11-10T14:20:00.000Z',
    previewContent: `# Web Development (CS501) — Unit 3 Study Material
## Web Services Architecture, AJAX & CORBA

### 1. Core Web Service Triad
1. **SOAP (Simple Object Access Protocol)**: XML-based messaging protocol (Envelope, Header, Body, Fault) transported over HTTP/SMTP.
2. **WSDL (Web Services Description Language)**: XML contract describing service endpoints, operations, bindings, and message schemas.
3. **UDDI (Universal Description, Discovery, and Integration)**: Directory registry enabling service providers to publish and consumers to discover WSDL endpoints.

### 2. AJAX (Asynchronous JavaScript and XML)
Improves web performance by sending background HTTP requests via \`XMLHttpRequest\` or \`fetch()\` and updating only targeted DOM nodes instead of reloading entire pages.

### 3. CORBA (Common Object Request Broker Architecture)
OMG standard allowing distributed objects written in different languages (C++, Java) to communicate via an Object Request Broker (ORB) and IDL (Interface Definition Language).`,
  },
  {
    id: 'mat-web-u4-web3',
    title: 'Unit 4 Important Questions: Web 2.0, Semantic Web 3.0, RDF & Edge Computing',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 4,
    category: 'Important Questions',
    fileType: 'PDF',
    fileSize: '1.6 MB',
    uploadDate: '2026-11-12',
    uploadedBy: 'Dr. Vikram Mehta',
    description: 'Curated mid-term and end-semester question bank with 2-mark, 5-mark, and 10-mark model answers for Web 2.0 mashups, RDF triples, recommender systems, blockchain benefits, and dark mode UX.',
    createdAt: '2026-11-12T09:10:00.000Z',
    previewContent: `# Unit 4 Exam Question Bank — Web Development (CS501)

1. **Differentiate Web 1.0, Web 2.0, and Web 3.0 with real-world examples.**
   - Web 1.0: Read-only static brochure sites.
   - Web 2.0: Read-Write participatory web (blogs, wikis, AJAX, RSS, Open APIs, Ruby on Rails).
   - Web 3.0: Semantic & decentralized web (RDF triples, Ontologies, Blockchain trust layers, Edge Computing).

2. **Explain RDF (Resource Description Framework) with a Subject-Predicate-Object triple.**
   Example: \`<QuantumUniversity> <offersCourse> <BTechCSE>\`.

3. **How do Recommender Systems and Edge Computing improve Web-Based Information Systems?**
   Collaborative filtering & content-based models personalize discovery, while Edge Computing caches and computes near the user to slash round-trip latency.

4. **Why is Dark Mode important in modern web development?**
   Reduces OLED display power consumption, lowers eye strain in low-ambient rooms, and relies on semantic design tokens with WCAG contrast compliance.`,
  },
  {
    id: 'mat-web-u5-web4',
    title: 'Unit 5 Notes: Web 4.0, AI-Powered Personalization, IoT, WebXR & 5G Impact',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 5,
    category: 'Lecture Notes',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    uploadDate: '2026-11-15',
    uploadedBy: 'Prof. Ananya Verma',
    description: 'Future web systems covering Symbiotic Web 4.0, adaptive interfaces, DWeb/IPFS, WebXR AR/VR pipelines, Web of Things, and ultra-low-latency 5G web applications.',
    createdAt: '2026-11-15T16:00:00.000Z',
    previewContent: `# Web Development (CS501) — Unit 5 Lecture Notes
## Web 4.0, AI-Powered Interfaces & Future Technologies

### 1. Web 4.0 (The Symbiotic & Autonomous Web)
Intelligent agents collaborate proactively with humans using context-aware reasoning, adaptive UI layouts, and automated multi-step web workflows.

### 2. Decentralized Web (DWeb) & Blockchain Integration
Content-addressed storage (IPFS), verifiable digital identities (DIDs), and smart contracts reduce single points of failure.

### 3. IoT, AR/VR & 5G Impact on the Web
- **Web of Things (WoT)**: Exposes IoT sensor telemetry via standard HTTP/WebSockets/MQTT-over-WS.
- **WebXR**: Renders immersive AR/VR experiences natively inside browsers using WebGL/WebGPU.
- **5G Impact**: Sub-10ms latency and multi-Gbps throughput unlock cloud-rendered 3D workspaces, real-time collaborative CAD, and live edge AI inference.`,
  },
  {
    id: 'mat-web-pyq-2025',
    title: 'Quantum University End-Sem PYQ Paper (CS501 Web Development 2025)',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 1,
    category: 'Previous Year Question Papers',
    fileType: 'PDF',
    fileSize: '1.1 MB',
    uploadDate: '2026-11-02',
    uploadedBy: 'Examination Cell',
    description: 'Official Quantum University Roorkee B.Tech CSE Semester V question paper with section-wise marking scheme (100 Marks, 3 Hours).',
    createdAt: '2026-11-02T08:00:00.000Z',
    previewContent: `# Quantum University, Roorkee — End Semester Examination
**Course:** B.Tech CSE (Semester V) | **Subject:** Web Development (CS501) | **Max Marks:** 100

**Section A (Short Answer — 10 × 2 = 20 Marks)**
1. Define MIME and list two Content-Type headers.
2. Compare POP3 and IMAP in terms of server synchronization.
3. What is a Document Type Definition (DTD)?
4. State the role of UDDI in Web Services.
5. Define RDF triple with an example.

**Section B (Analytical — 5 × 8 = 40 Marks)**
1. Explain the complete DNS lookup sequence from browser cache to authoritative server.
2. Compare DOM and SAX XML processors with architecture diagrams and memory complexity.
3. Write an AJAX snippet using fetch/XHR to load JSON student records dynamically.

**Section C (Design & Long Answer — 2 × 20 = 40 Marks)**
1. Design a SOAP + WSDL architecture for an online university grade verification service.
2. Discuss how AI-powered personalization, WebXR, and 5G transform Web 4.0 adaptive interfaces.`,
  },
  {
    id: 'mat-web-lab-manual',
    title: 'CS501 Web Development Lab Manual (HTML5, CSS3, AJAX & XML Experiments)',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 2,
    category: 'Lab Manuals',
    fileType: 'DOCX',
    fileSize: '3.7 MB',
    uploadDate: '2026-10-28',
    uploadedBy: 'Prof. Ananya Verma',
    description: '10 structured practical lab experiments with problem statements, viva questions, and sample DOM/AJAX implementations.',
    createdAt: '2026-10-28T10:00:00.000Z',
    previewContent: `# CS501 Web Development Lab Manual
1. Experiment 1: Semantic University Portal Layout using HTML5 & CSS Grid
2. Experiment 2: Interactive Registration Form with Client-Side Validation
3. Experiment 3: Parsing Student Catalog XML using DOMParser & XSLT
4. Experiment 4: Asynchronous Weather & Notice Feed using AJAX
5. Experiment 5: Consuming a REST/SOAP Web Service Endpoint`,
  },
  {
    id: 'mat-web-practical-file',
    title: 'Solved Practical File: DOM Tree Traversal & Dynamic Table Generator',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 2,
    category: 'Practical Files',
    fileType: 'CODE',
    fileSize: '640 KB',
    uploadDate: '2026-11-08',
    uploadedBy: 'Prof. Ananya Verma',
    description: 'Verified practical file code demonstrating JavaScript DOM nodes, event delegation, and XML Schema validation.',
    createdAt: '2026-11-08T12:00:00.000Z',
    previewContent: `// Practical 04: Dynamic XML to HTML Table Renderer using DOMParser
const xmlString = \`<students><student><id>QU042</id><name>Aarav</name></student></students>\`;
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
const students = Array.from(xmlDoc.getElementsByTagName('student'));
students.forEach((node) => {
  console.log(node.querySelector('id')?.textContent, node.querySelector('name')?.textContent);
});`,
  },
  {
    id: 'mat-web-ref-book',
    title: 'Reference Book Summary: Web Technologies (Uttam K. Roy) — Key Chapters',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 3,
    category: 'Reference Books',
    fileType: 'PDF',
    fileSize: '5.4 MB',
    uploadDate: '2026-10-22',
    uploadedBy: 'Central Library',
    description: 'Curated chapter summaries covering HTTP, XML, Servlets, Web Services, and AJAX patterns aligned with the CS501 syllabus.',
    createdAt: '2026-10-22T09:00:00.000Z',
    previewContent: `# Reference Book Digest: Web Technologies
Key chapters mapped to Quantum University B.Tech CSE CS501:
- Ch. 2: Internet Protocols (HTTP, SMTP, POP3, IMAP, DNS)
- Ch. 4–5: HTML, CSS, DHTML & Event Handling
- Ch. 8: XML, DTD, XSD, DOM & SAX
- Ch. 12: Web Services (SOAP, WSDL, UDDI) & AJAX`,
  },
  {
    id: 'mat-web-assign-sheet',
    title: 'Assignment Sheet 01: HTTP Packet Trace & DNS Lookup Report',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 1,
    category: 'Assignments',
    fileType: 'PDF',
    fileSize: '920 KB',
    uploadDate: '2026-11-05',
    uploadedBy: 'Prof. Ananya Verma',
    description: 'Rubric and submission template for Unit 1 protocol inspection assignment.',
    createdAt: '2026-11-05T13:00:00.000Z',
    previewContent: `# Assignment Sheet 01 — Protocol Analysis
Document HTTP status codes (200, 301, 404, 500), MIME headers, and dig/nslookup recursive DNS resolution trace.`,
  },
  {
    id: 'mat-dsa-u1-notes',
    title: 'DAA Unit 1 Notes: Master Theorem & Recurrence Solving Techniques',
    subjectId: 'subj-dsa',
    subjectName: 'Design & Analysis of Algorithms',
    unitNumber: 1,
    category: 'Lecture Notes',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    uploadDate: '2026-11-09',
    uploadedBy: 'Dr. Rajeev Joshi',
    description: 'Step-by-step solved examples of substitution method, recursion trees, and all three cases of the Master Theorem.',
    createdAt: '2026-11-09T10:00:00.000Z',
    previewContent: `# Design & Analysis of Algorithms — Unit 1
Master Theorem for T(n) = aT(n/b) + f(n):
- Case 1: f(n) = O(n^(log_b(a) - ε)) -> Θ(n^log_b(a))
- Case 2: f(n) = Θ(n^log_b(a)) -> Θ(n^log_b(a) log n)
- Case 3: f(n) = Ω(n^(log_b(a) + ε)) -> Θ(f(n))`,
  },
  {
    id: 'mat-dbms-u3-notes',
    title: 'DBMS Unit 3 Notes: Normalization (1NF to BCNF) Solved Problems',
    subjectId: 'subj-dbms',
    subjectName: 'Database Management Systems',
    unitNumber: 3,
    category: 'PDF Notes',
    fileType: 'PDF',
    fileSize: '2.2 MB',
    uploadDate: '2026-11-11',
    uploadedBy: 'Prof. Neha Kulkarni',
    description: 'Candidate key finding algorithm, canonical cover, 3NF synthesis, and BCNF lossless decomposition examples.',
    createdAt: '2026-11-11T15:00:00.000Z',
    previewContent: `# Database Management Systems — Unit 3 Normalization
A relation R is in BCNF if for every non-trivial functional dependency X -> Y, X is a superkey of R.`,
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-web-1',
    title: 'HTTP/SMTP Protocol Trace & DNS Resolution Report',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 1,
    description:
      'Capture and annotate an HTTP/1.1 vs HTTP/2 request cycle using browser DevTools, compare POP3 vs IMAP sync behavior, and document a full iterative DNS lookup trace.',
    dueDate: '2026-11-29',
    maxMarks: 20,
    createdAt: '2026-11-05T10:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'assign-web-2',
    title: 'XML Schema Design & DOM vs SAX Benchmark',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 2,
    description:
      'Author an XML catalog for B.Tech courses validated by an XSD schema, then build a DHTML page using DOM traversal and compare memory usage against a SAX stream parser.',
    dueDate: '2026-12-04',
    maxMarks: 25,
    createdAt: '2026-11-10T10:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'assign-web-3',
    title: 'AJAX Live Search & SOAP WSDL Service Contract',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 3,
    description:
      'Implement an asynchronous AJAX lookup widget without page reloads and write a WSDL 1.1 contract defining SOAP request/response portTypes for student verification.',
    dueDate: '2026-12-10',
    maxMarks: 30,
    createdAt: '2026-11-14T10:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'assign-dsa-1',
    title: 'Dynamic Programming Problem Set (LCS & Knapsack)',
    subjectId: 'subj-dsa',
    subjectName: 'Design & Analysis of Algorithms',
    unitNumber: 3,
    description:
      'Submit recurrence formulations, DP state transition tables, and time/space complexity proofs for 0/1 Knapsack and Longest Common Subsequence.',
    dueDate: '2026-12-02',
    maxMarks: 20,
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: NOW,
  },
];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'demo-student-aarav_assign-web-1',
    userId: 'demo-student-aarav',
    assignmentId: 'assign-web-1',
    status: 'completed',
    fileName: 'Aarav_CS501_Unit1_Protocol_Report.pdf',
    notes: 'Included Wireshark HTTP header trace and dig +trace DNS resolution output.',
    submittedAt: '2026-11-16T17:45:00.000Z',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-web-u1',
    title: 'Unit 1 Assessment: Internet Protocols & Web Architecture',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 1,
    durationMinutes: 5,
    createdAt: '2026-11-04T10:00:00.000Z',
    questions: [
      {
        id: 'q1-1',
        question: 'Which email protocol keeps messages synchronized on the server across multiple client devices by default?',
        options: ['SMTP', 'POP3', 'IMAP', 'MIME'],
        correctIndex: 2,
        explanation: 'IMAP (Internet Message Access Protocol) stores and synchronizes mailboxes directly on the server, unlike POP3 which typically downloads and removes mail.',
      },
      {
        id: 'q1-2',
        question: 'What is the primary role of MIME in Internet email systems?',
        options: [
          'Assigning dynamic IP addresses to mail servers',
          'Extending SMTP to support attachments, images, and non-ASCII text',
          'Encrypting TCP port 80 browser traffic',
          'Translating domain names into IPv4 addresses',
        ],
        correctIndex: 1,
        explanation: 'MIME (Multipurpose Internet Mail Extensions) defines headers and encodings so SMTP can transmit binary attachments, HTML, audio, and UTF-8 text.',
      },
      {
        id: 'q1-3',
        question: 'Which DNS component is contacted first after local browser/OS caches miss during recursive name resolution?',
        options: ['Authoritative Name Server', 'TLD Server (.edu)', 'Root Name Server', 'SMTP Relay'],
        correctIndex: 2,
        explanation: 'A recursive DNS resolver begins at the Root Name Server (.), which directs it to the Top-Level Domain (TLD) server and then to the authoritative server.',
      },
      {
        id: 'q1-4',
        question: 'Why is HTTP described as a stateless protocol?',
        options: [
          'It cannot transmit HTML forms',
          'Each request is processed independently without retaining prior request context by default',
          'It runs over UDP instead of TCP',
          'It prohibits caching in web browsers',
        ],
        correctIndex: 1,
        explanation: 'HTTP treats each request-response transaction independently; state is layered on top via cookies, sessions, or tokens.',
      },
      {
        id: 'q1-5',
        question: 'Who proposed the World Wide Web architecture combining HTML, HTTP, and URLs in 1989?',
        options: ['Vint Cerf', 'Tim Berners-Lee', 'Marc Andreessen', 'James Gosling'],
        correctIndex: 1,
        explanation: 'Tim Berners-Lee invented the World Wide Web while working at CERN in 1989–1991.',
      },
    ],
  },
  {
    id: 'quiz-web-u2',
    title: 'Unit 2 Assessment: DHTML, CSS DTD, XML, DOM & SAX',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 2,
    durationMinutes: 6,
    createdAt: '2026-11-08T10:00:00.000Z',
    questions: [
      {
        id: 'q2-1',
        question: 'Which XML processor is best suited for parsing a 1.2 GB log file with minimal memory footprint?',
        options: ['DOM Parser', 'SAX Parser', 'CSSOM Engine', 'XSLT Tree Builder'],
        correctIndex: 1,
        explanation: 'SAX (Simple API for XML) is event-driven and streams nodes sequentially without loading the entire document tree into RAM.',
      },
      {
        id: 'q2-2',
        question: 'Which advantage does XML Schema (XSD) have over Document Type Definition (DTD)?',
        options: [
          'XSD cannot validate element hierarchy',
          'XSD supports strong data types, namespaces, and is itself written in XML',
          'XSD only works with HTML frames',
          'DTD supports more primitive numeric types than XSD',
        ],
        correctIndex: 1,
        explanation: 'XML Schema (XSD) is XML-based and provides built-in data types (integers, dates, patterns) and namespace support.',
      },
      {
        id: 'q2-3',
        question: 'Dynamic HTML (DHTML) is the combination of which core client-side technologies?',
        options: [
          'SQL, PHP, and Apache',
          'HTML, CSS, JavaScript, and the Document Object Model (DOM)',
          'SOAP, WSDL, and UDDI',
          'SMTP, POP3, and IMAP',
        ],
        correctIndex: 1,
        explanation: 'DHTML uses HTML for structure, CSS for styling, and JavaScript + DOM to manipulate elements interactively after page load.',
      },
      {
        id: 'q2-4',
        question: 'In HTML tables, which attribute merges multiple adjacent columns into a single header cell?',
        options: ['rowspan', 'colspan', 'cellpadding', 'scope'],
        correctIndex: 1,
        explanation: 'The colspan attribute specifies how many horizontal columns a cell should span.',
      },
    ],
  },
  {
    id: 'quiz-web-u3',
    title: 'Unit 3 Assessment: Web Services, SOAP, WSDL, AJAX & CORBA',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 3,
    durationMinutes: 5,
    createdAt: '2026-11-11T10:00:00.000Z',
    questions: [
      {
        id: 'q3-1',
        question: 'In a Service-Oriented Architecture (SOA), which XML standard acts as the machine-readable contract describing operations and endpoints?',
        options: ['UDDI', 'WSDL', 'HTML', 'RSS'],
        correctIndex: 1,
        explanation: 'WSDL (Web Services Description Language) describes the service interface, message formats, bindings, and endpoint URL.',
      },
      {
        id: 'q3-2',
        question: 'How does AJAX improve perceived web page performance?',
        options: [
          'By compiling JavaScript into C++ on the server',
          'By exchanging small data payloads asynchronously and updating only parts of the DOM',
          'By disabling CSS stylesheets',
          'By replacing DNS with static IP tables',
        ],
        correctIndex: 1,
        explanation: 'AJAX avoids full-page reloads by fetching data in the background and updating targeted DOM regions.',
      },
      {
        id: 'q3-3',
        question: 'Which component in CORBA mediates requests between distributed client stubs and server skeletons across languages?',
        options: ['UDDI Registry', 'Object Request Broker (ORB)', 'SAX Handler', 'MIME Gateway'],
        correctIndex: 1,
        explanation: 'The Object Request Broker (ORB) handles marshaling, routing, and invocation between heterogeneous distributed objects.',
      },
    ],
  },
  {
    id: 'quiz-web-u4',
    title: 'Unit 4 Assessment: Web 2.0, Semantic Web 3.0 & Edge Systems',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 4,
    durationMinutes: 5,
    createdAt: '2026-11-13T10:00:00.000Z',
    questions: [
      {
        id: 'q4-1',
        question: 'What is the fundamental data model of RDF (Resource Description Framework) in the Semantic Web?',
        options: [
          'Key-value cookies',
          'Subject–Predicate–Object triples',
          'Fixed-width CSV records',
          'HTML framesets',
        ],
        correctIndex: 1,
        explanation: 'RDF represents semantic knowledge as directed graph triples: Subject, Predicate, and Object.',
      },
      {
        id: 'q4-2',
        question: 'Which Web 2.0 pattern combines data or UI from two or more external Open APIs into a single unified web application?',
        options: ['Mashup', 'CORBA Stub', 'DTD', 'POP3'],
        correctIndex: 0,
        explanation: 'Mashups aggregate Open APIs (such as maps, weather, or feeds) into a cohesive interactive interface.',
      },
      {
        id: 'q4-3',
        question: 'What is a key benefit of Edge Computing for modern web applications?',
        options: [
          'Increases round-trip distance to central data centers',
          'Processes requests closer to end users, reducing latency and bandwidth bottlenecks',
          'Eliminates the need for web browsers',
          'Replaces HTTPS with unencrypted HTTP',
        ],
        correctIndex: 1,
        explanation: 'Edge Computing runs logic and caching at geographically distributed edge nodes near users.',
      },
    ],
  },
  {
    id: 'quiz-web-u5',
    title: 'Unit 5 Assessment: Web 4.0, AI Web, DWeb, WebXR & 5G',
    subjectId: 'subj-web-dev',
    subjectName: 'Web Development',
    unitNumber: 5,
    durationMinutes: 5,
    createdAt: '2026-11-16T10:00:00.000Z',
    questions: [
      {
        id: 'q5-1',
        question: 'How does Web 4.0 (Symbiotic Web) extend Web 3.0 capabilities?',
        options: [
          'By removing JavaScript from browsers',
          'By combining AI-driven personalization, adaptive interfaces, and autonomous web agents',
          'By restricting websites to static HTML 1.0',
          'By storing all data only on floppy disks',
        ],
        correctIndex: 1,
        explanation: 'Web 4.0 emphasizes intelligent, context-aware human-machine symbiosis, adaptive interfaces, and proactive automation.',
      },
      {
        id: 'q5-2',
        question: 'Which impact does 5G connectivity have on WebXR (AR/VR) and IoT web dashboards?',
        options: [
          'Higher packet delay and lower concurrency',
          'Ultra-low latency and high bandwidth enabling real-time 3D streaming and dense IoT telemetry',
          'Disables WebSockets in mobile browsers',
          'Limits websites to text-only rendering',
        ],
        correctIndex: 1,
        explanation: '5G provides millisecond-range latency and massive device density, making cloud-assisted WebXR and real-time IoT web apps practical.',
      },
    ],
  },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'attempt-demo-1',
    userId: 'demo-student-aarav',
    quizId: 'quiz-web-u1',
    quizTitle: 'Unit 1 Assessment: Internet Protocols & Web Architecture',
    subjectName: 'Web Development',
    unitNumber: 1,
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    answers: [2, 1, 2, 1, 0],
    timeSpentSeconds: 142,
    completedAt: '2026-11-15T14:20:00.000Z',
  },
];

export const INITIAL_PROGRESS: UserProgress = {
  userId: 'demo-student-aarav',
  completedUnits: ['subj-web-dev_unit_1', 'subj-web-dev_unit_2', 'subj-dsa_unit_1'],
  bookmarkedMaterialIds: ['mat-web-u1-notes', 'mat-web-pyq-2025'],
  updatedAt: NOW,
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'B.Tech CSE Semester V End-Term Practical Schedule Released',
    body: 'CS501 Web Development and CS502 DAA practical examinations at Quantum University, Roorkee begin December 8, 2026. Ensure all unit lab files and XML/AJAX records are uploaded.',
    category: 'Exam',
    authorName: 'Dr. Vikram Mehta',
    publishedAt: '2026-11-18T08:00:00.000Z',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'Unit 4 & Unit 5 Web Technologies Revision Seminar',
    body: 'Special doubt-clearing session covering RDF Semantic Web, Edge Computing, and Web 4.0 AI Architectures on Friday at 3:00 PM in Block B Auditorium.',
    category: 'Academic',
    authorName: 'Prof. Ananya Verma',
    publishedAt: '2026-11-16T11:30:00.000Z',
    pinned: false,
  },
  {
    id: 'ann-3',
    title: 'Campus Placement Mock Technical Test — Full Stack Track',
    body: 'Attempt Units 1–3 quizzes on Quantum Study before Sunday 8:00 PM to qualify for the Roorkee Campus Coding Cohort.',
    category: 'Placement',
    authorName: 'Training & Placement Cell',
    publishedAt: '2026-11-14T09:45:00.000Z',
    pinned: false,
  },
];
