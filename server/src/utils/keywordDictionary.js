/**
 * Industry Standard Tech Keyword & Skills Ontology
 */

export const TECH_SKILLS = {
  frontend: [
    'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'vuejs', 'angular',
    'angularjs', 'svelte', 'typescript', 'javascript', 'html', 'html5', 'css', 'css3',
    'tailwind', 'tailwindcss', 'bootstrap', 'sass', 'scss', 'redux', 'redux toolkit', 'zustand',
    'mobx', 'graphql', 'apollo client', 'webpack', 'vite', 'esbuild', 'responsive design',
    'framer motion', 'material ui', 'shadcn', 'chakra ui', 'web vitals', 'seo'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'express.js', 'nestjs', 'fastify', 'python', 'django',
    'flask', 'fastapi', 'java', 'spring', 'spring boot', 'golang', 'go', 'c#', '.net',
    'asp.net', 'c++', 'rust', 'ruby', 'ruby on rails', 'php', 'laravel', 'microservices',
    'rest api', 'restful api', 'grpc', 'websocket', 'socket.io', 'message queues', 'kafka',
    'rabbitmq', 'event-driven architecture', 'mvc'
  ],
  database: [
    'postgresql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis', 'elasticsearch',
    'dynamodb', 'cassandra', 'prisma', 'typeorm', 'sequelize', 'mongoose', 'sql',
    'nosql', 'neo4j', 'database indexing', 'sharding', 'acid', 'stored procedures'
  ],
  devops_cloud: [
    'docker', 'kubernetes', 'k8s', 'aws', 'amazon web services', 'ec2', 's3', 'lambda',
    'gcp', 'google cloud', 'azure', 'terraform', 'ci/cd', 'github actions', 'gitlab ci',
    'jenkins', 'ansible', 'linux', 'bash', 'shell scripting', 'nginx', 'prometheus',
    'grafana', 'datadog', 'cloudwatch', 'serverless', 'helm'
  ],
  testing_quality: [
    'jest', 'vitest', 'cypress', 'playwright', 'selenium', 'mocha', 'chai', 'supertest',
    'unit testing', 'integration testing', 'e2e testing', 'tdd', 'test driven development',
    'sonarqube', 'postman', 'swagger', 'openapi'
  ],
  ai_data: [
    'machine learning', 'deep learning', 'artificial intelligence', 'genai', 'generative ai',
    'llm', 'large language models', 'langchain', 'gemini', 'openai', 'huggingface', 'nlp',
    'natural language processing', 'computer vision', 'pandas', 'numpy', 'scikit-learn',
    'tensorflow', 'pytorch', 'rag', 'vector database', 'embeddings'
  ],
  soft_skills: [
    'agile', 'scrum', 'leadership', 'cross-functional collaboration', 'problem solving',
    'communication', 'code review', 'mentorship', 'system design', 'stakeholder management',
    'strategic thinking', 'performance optimization', 'critical thinking'
  ]
};

// Flattened list of all canonical skills for fast O(1) set lookup
export const ALL_SKILLS_SET = new Set(
  Object.values(TECH_SKILLS).flatMap(category => category.map(s => s.toLowerCase()))
);

// Standard Resume Section Header Patterns
export const SECTION_PATTERNS = {
  experience: /(?:experience|employment|work history|professional background|work experience)/i,
  education: /(?:education|academic background|qualifications|degrees)/i,
  skills: /(?:skills|technical skills|technologies|core competencies|toolset)/i,
  projects: /(?:projects|personal projects|key projects|academic projects)/i,
  certifications: /(?:certifications|certificates|licenses|credentials|awards)/i,
  summary: /(?:summary|profile|about me|professional summary|objective)/i,
};
