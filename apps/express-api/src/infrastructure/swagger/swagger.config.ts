import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: process.env.SWAGGER_TITLE ?? "Waste Management API",
      version: process.env.SWAGGER_VERSION ?? "1.0.0",
      description:
        "Production-grade REST API for the Waste Management Logistics Platform. Built with Clean Architecture + TypeScript.",
      contact: {
        name: "API Support",
        email: process.env.SUPER_ADMIN_EMAIL ?? "admin@wm-platform.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT ?? 3001}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "firstName", "lastName"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: {
              type: "string",
              enum: ["SUPER_ADMIN", "ENTERPRISE_MANAGER", "CHAUFFEUR"],
              default: "ENTERPRISE_MANAGER",
            },
            enterpriseId: { type: "string", format: "uuid" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentication & authorization endpoints" },
      {
        name: "Enterprises",
        description: "Multi-tenant enterprise management",
      },
      { name: "Chauffeurs", description: "Chauffeur and vehicle management" },
      {
        name: "WasteCollections",
        description: "Waste collection lifecycle management",
      },
    ],
  },
  apis: ["./src/interfaces/controllers/*.ts", "./src/interfaces/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
