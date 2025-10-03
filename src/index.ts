#!/usr/bin/env node
/**
 * MCP Server generated from OpenAPI spec for adblast-api-documentation v1.0.0
 * Generated on: 2025-10-03T01:12:58.394Z
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";
import { setupStreamableHttpServer } from "./streamable-http.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Async local storage for session-specific data
 */
export const sessionStorage = new AsyncLocalStorage<{ bearerToken?: string }>();

/**
 * Type definition for JSON objects
 */
type JsonObject = Record<string, any>;

/**
 * Interface for MCP Tool Definition
 */
interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
}

/**
 * Server configuration
 */
export const SERVER_NAME = "adblast-api-documentation";
export const SERVER_VERSION = "1.0.0";
export const API_BASE_URL = "https://dev.adblast.ai";

/**
 * MCP Server instance
 */
const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
);

/**
 * Map of tool definitions by name
 */
const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["healthCheck", {
    name: "healthCheck",
    description: `Health check endpoint for API status and authentication verification.`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/api",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["listProjects", {
    name: "listProjects",
    description: `List Projects`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/api/projects",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["createProject", {
    name: "createProject",
    description: `Create Project`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"title":{"type":"string","description":"The project title."},"visual_style":{"type":["string","null"],"description":"The visual style enum value.","enum":["Realistic 35mm Film","Oil Painting","Stop Frame Animation","CinePlastic","90s Comic Book Art","Origami Style","Storybook Style"]},"length_seconds":{"type":["number","null"],"description":"The video length in seconds (1-600)."}},"required":["title"],"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/api/projects",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getProject", {
    name: "getProject",
    description: `Retrieve the full project object`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateProject", {
    name: "updateProject",
    description: `Update Project`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"title":{"type":["string","null"],"description":"The new project title."},"ad_idea":{"type":["string","null"],"description":"The new ad idea description."}},"description":"The JSON request body."}},"required":["project_id"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["deleteProject", {
    name: "deleteProject",
    description: `Delete Project`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "delete",
    pathTemplate: "/api/projects/{project_id}",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["getProjectDataSchema", {
    name: "getProjectDataSchema",
    description: `Retrieve the JSON schema for project data validation`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/api/projects/data/schema",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["getProjectData", {
    name: "getProjectData",
    description: `Retrieve the project's JSON data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/data",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateProjectData", {
    name: "updateProjectData",
    description: `Update Project Data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"data":{"type":"string","description":"Must be a valid JSON string."}},"required":["data"],"description":"The JSON request body."}},"required":["project_id","requestBody"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/data",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getProjectVersions", {
    name: "getProjectVersions",
    description: `Retrieve all versions of the project's data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/versions",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["revertProjectVersion", {
    name: "revertProjectVersion",
    description: `Revert the project data to a specific version`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"versionId":{"type":"string"},"requestBody":{"type":"object","properties":{"versionId":{"type":"string","description":"The version ID to revert to."}},"required":["versionId"],"description":"The JSON request body."}},"required":["project_id","versionId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/versions/{versionId}/revert",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"versionId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["duplicateProject", {
    name: "duplicateProject",
    description: `Create a copy of the project with all data and storage assets`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/duplicate",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["getScore", {
    name: "getScore",
    description: `Retrieve the score configuration from the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/score",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateScore", {
    name: "updateScore",
    description: `Update the score configuration in the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Whether the full film score is generating"}},"description":"The JSON request body."}},"required":["project_id"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/score",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["clearScore", {
    name: "clearScore",
    description: `Reset the score configuration to the default state`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "delete",
    pathTemplate: "/api/projects/{project_id}/score",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeScoreUpload", {
    name: "finalizeScoreUpload",
    description: `Finalize a score upload and update the score URL in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/score/finalize-upload",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["setScoreProcessing", {
    name: "setScoreProcessing",
    description: `Set the processing status for score`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Processing status"}},"required":["processing"],"description":"The JSON request body."}},"required":["project_id","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/score/processing",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getCharacters", {
    name: "getCharacters",
    description: `Retrieve all characters from the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/characters",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["createCharacter", {
    name: "createCharacter",
    description: `Add a new character to the project data based on schema structure`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"id":{"type":"string","description":"Character unique valid uuid."},"prompt":{"type":"string","description":"Character description prompt."},"processing":{"type":"boolean","description":"Whether the character image is generating. Defaults to false"}},"required":["id","prompt"],"description":"The JSON request body."}},"required":["project_id","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/characters",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getCharacter", {
    name: "getCharacter",
    description: `Retrieve a specific character by its ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"characterId":{"type":"string"}},"required":["project_id","characterId"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/characters/{characterId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"characterId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateCharacter", {
    name: "updateCharacter",
    description: `Update an existing character by its ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"characterId":{"type":"string"},"requestBody":{"type":"object","properties":{"prompt":{"type":"string","description":"Character description prompt."},"processing":{"type":"boolean","description":"Whether the character image is generating"}},"description":"The JSON request body."}},"required":["project_id","characterId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/characters/{characterId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"characterId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["deleteCharacter", {
    name: "deleteCharacter",
    description: `Remove a character from the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"characterId":{"type":"string"}},"required":["project_id","characterId"]},
    method: "delete",
    pathTemplate: "/api/projects/{project_id}/characters/{characterId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"characterId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeCharacterImageUpload", {
    name: "finalizeCharacterImageUpload",
    description: `Finalize a character image upload and update the character image URL in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"characterId":{"type":"string"},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response."},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","characterId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/characters/{characterId}/finalize-image-upload",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"characterId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["setCharacterProcessing", {
    name: "setCharacterProcessing",
    description: `Set the processing status for a character`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"characterId":{"type":"string"},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Processing status"}},"required":["processing"],"description":"The JSON request body."}},"required":["project_id","characterId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/characters/{characterId}/processing",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"characterId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getEnvironments", {
    name: "getEnvironments",
    description: `Retrieve all environments from the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/environments",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["createEnvironment", {
    name: "createEnvironment",
    description: `Add a new environment to the project data based on schema structure`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"id":{"type":"string","description":"Environment unique valid uuid."},"prompt":{"type":"string","description":"Environment description prompt."},"processing":{"type":"boolean","description":"Whether the environment image is generating."}},"required":["id","prompt"],"description":"The JSON request body."}},"required":["project_id","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/environments",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getEnvironment", {
    name: "getEnvironment",
    description: `Retrieve a specific environment by its ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"environmentId":{"type":"string"}},"required":["project_id","environmentId"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/environments/{environmentId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"environmentId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateEnvironment", {
    name: "updateEnvironment",
    description: `Update an existing environment by its ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"environmentId":{"type":"string"},"requestBody":{"type":"object","properties":{"prompt":{"type":"string","description":"Environment description prompt"},"processing":{"type":"boolean","description":"Whether the environment image is generating"}},"description":"The JSON request body."}},"required":["project_id","environmentId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/environments/{environmentId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"environmentId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["deleteEnvironment", {
    name: "deleteEnvironment",
    description: `Remove an environment from the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"environmentId":{"type":"string"}},"required":["project_id","environmentId"]},
    method: "delete",
    pathTemplate: "/api/projects/{project_id}/environments/{environmentId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"environmentId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeEnvironmentImageUpload", {
    name: "finalizeEnvironmentImageUpload",
    description: `Finalize an environment image upload and update the environment image URL in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"environmentId":{"type":"string"},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","environmentId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/environments/{environmentId}/finalize-image-upload",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"environmentId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["setEnvironmentProcessing", {
    name: "setEnvironmentProcessing",
    description: `Set the processing status for an environment`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"environmentId":{"type":"string"},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Processing status"}},"required":["processing"],"description":"The JSON request body."}},"required":["project_id","environmentId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/environments/{environmentId}/processing",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"environmentId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getScenes", {
    name: "getScenes",
    description: `Retrieve all scenes from the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/scenes",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["getScene", {
    name: "getScene",
    description: `Retrieve a specific scene by its ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"}},"required":["project_id","sceneId"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateScene", {
    name: "updateScene",
    description: `Update an existing scene by its ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"requestBody":{"type":"object","properties":{"number":{"type":"number","description":"Scene number starting from 1, increasing sequentially"},"label":{"type":"string","description":"Narrative function.","enum":["HOOK","FORESHADOW_VALUE_DISCOVERY","ALL_IS_LOST_SOLUTION_TRIGGER","CLIMAX_TWIST_PAYOFF","TRANSFORMATION_CTA"]},"visible_goal":{"type":"string","description":"The visible goal of the scene"}},"description":"The JSON request body."}},"required":["project_id","sceneId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getVisuals", {
    name: "getVisuals",
    description: `Retrieve all visuals for a specific scene`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"}},"required":["project_id","sceneId"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["createVisual", {
    name: "createVisual",
    description: `Add a new visual to a scene with basic structure`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"requestBody":{"type":"object","properties":{"number":{"type":"number","description":"Visual number inside this scene, starting from 1"},"duration_seconds":{"type":"number","description":"Playback duration in seconds (supports fractional values)"},"description":{"type":"string","description":"Visual short description"},"id":{"type":"string","description":"Visual unique valid uuid"}},"required":["number","duration_seconds","description","id"],"description":"The JSON request body."}},"required":["project_id","sceneId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getVisual", {
    name: "getVisual",
    description: `Retrieve a specific visual by scene ID and visual ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"}},"required":["project_id","sceneId","visualId"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateVisual", {
    name: "updateVisual",
    description: `Update an existing visual by scene ID and visual ID`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"number":{"type":"number","description":"Visual number inside this scene, starting from 1"},"duration_seconds":{"type":"number","description":"Playback duration in seconds (supports fractional values)"},"description":{"type":"string","description":"Visual short description"}},"description":"The JSON request body."}},"required":["project_id","sceneId","visualId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["deleteVisual", {
    name: "deleteVisual",
    description: `Remove a visual from a scene`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"}},"required":["project_id","sceneId","visualId"]},
    method: "delete",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateVisualVoiceover", {
    name: "updateVisualVoiceover",
    description: `Update the voiceover configuration for a specific visual`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"text":{"type":"string","description":"The voiceover text"},"voiceover_url":{"type":"string","description":"Remote voiceover URL to download and store"},"voiceover_uploaded_url":{"type":"string","description":"Remote uploaded voiceover URL to download and store"}},"description":"The JSON request body."}},"required":["project_id","sceneId","visualId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/voiceovers",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeVisualVoiceoverUpload", {
    name: "finalizeVisualVoiceoverUpload",
    description: `Finalize a voiceover asset upload and update the voiceover_url in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/voiceovers/finalize-upload",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeVisualVoiceoverUploaded", {
    name: "finalizeVisualVoiceoverUploaded",
    description: `Finalize an uploaded voiceover asset upload and update the voiceover_uploaded_url in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/voiceovers/finalize-uploaded-upload",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["updateVisualImage", {
    name: "updateVisualImage",
    description: `Update the text_to_image configuration for a specific visual`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"prompt":{"type":"string","description":"The full rendering instruction for text to image"},"visible_characters":{"type":"array","description":"List of character IDs visible in this image","items":{"type":"string"}},"visible_environments":{"type":"array","description":"List of environment IDs visible in this image","items":{"type":"string"}},"image_url":{"type":"string","description":"Remote image URL to download and store"}},"description":"The JSON request body."}},"required":["project_id","sceneId","visualId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/images",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeVisualImageUpload", {
    name: "finalizeVisualImageUpload",
    description: `Finalize a text_to_image asset upload and update the image_url in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/images/finalize-upload",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["setVisualImageProcessing", {
    name: "setVisualImageProcessing",
    description: `Set the processing status for text_to_image generation`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Processing status"}},"required":["processing"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/images/processing",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["updateVisualVideo", {
    name: "updateVisualVideo",
    description: `Update the image_to_video configuration for a specific visual`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"prompt":{"type":"string","description":"The prompt for image to video generation"},"video_url":{"type":"string","description":"Remote video URL to download and store"}},"description":"The JSON request body."}},"required":["project_id","sceneId","visualId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/videos",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeVisualVideoUpload", {
    name: "finalizeVisualVideoUpload",
    description: `Finalize an image_to_video asset upload and update the video_url in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/videos/finalize-upload",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["setVidualVideoProcessing", {
    name: "setVidualVideoProcessing",
    description: `Set the processing status for image_to_video generation`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Processing status"}},"required":["processing"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/videos/processing",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["updateVisualSound", {
    name: "updateVisualSound",
    description: `Update the sound configuration for a specific visual`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"prompt":{"type":"string","description":"The prompt for sound generation"},"sound_url":{"type":"string","description":"Remote sound URL to download and store"}},"description":"The JSON request body."}},"required":["project_id","sceneId","visualId"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/sounds",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeVisualSoundUpload", {
    name: "finalizeVisualSoundUpload",
    description: `Finalize a sound asset upload and update the sound_url in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/sounds/finalize-upload",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["setVisualSoundProcessing", {
    name: "setVisualSoundProcessing",
    description: `Set the processing status for sound generation`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"sceneId":{"type":"string"},"visualId":{"type":"string"},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Processing status"}},"required":["processing"],"description":"The JSON request body."}},"required":["project_id","sceneId","visualId","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/scenes/{sceneId}/visuals/{visualId}/sounds/processing",
    executionParameters: [{"name":"project_id","in":"path"},{"name":"sceneId","in":"path"},{"name":"visualId","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["getVideo", {
    name: "getVideo",
    description: `Retrieve the video configuration from the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "get",
    pathTemplate: "/api/projects/{project_id}/video",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["updateVideo", {
    name: "updateVideo",
    description: `Update the video configuration in the project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Whether the full stitched video is generating"}},"description":"The JSON request body."}},"required":["project_id"]},
    method: "put",
    pathTemplate: "/api/projects/{project_id}/video",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["clearVideo", {
    name: "clearVideo",
    description: `Reset the video configuration to the default state`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."}},"required":["project_id"]},
    method: "delete",
    pathTemplate: "/api/projects/{project_id}/video",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"default":[]}]
  }],
  ["finalizeVideoUpload", {
    name: "finalizeVideoUpload",
    description: `Finalize a video upload and update the video URL in project data`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"uuid":{"type":"string","description":"Upload UUID from S3M finalize response"},"cdn_url":{"type":"string","description":"CDN URL from S3M finalize response"},"path":{"type":"string","description":"Relative path from S3M finalize response"}},"required":["uuid","cdn_url","path"],"description":"The JSON request body."}},"required":["project_id","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/video/finalize-upload",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
  ["setVideoProcessing", {
    name: "setVideoProcessing",
    description: `Set the processing status for video`,
    inputSchema: {"type":"object","properties":{"project_id":{"type":"string","description":"The ID of the project."},"requestBody":{"type":"object","properties":{"processing":{"type":"boolean","description":"Processing status"}},"required":["processing"],"description":"The JSON request body."}},"required":["project_id","requestBody"]},
    method: "post",
    pathTemplate: "/api/projects/{project_id}/video/processing",
    executionParameters: [{"name":"project_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"default":[]}]
  }],
]);

/**
 * Security schemes from the OpenAPI spec
 */
const securitySchemes =   {
    "default": {
      "type": "http",
      "scheme": "bearer",
      "description": "You can retrieve your token by visiting your <a target=\"_blank\" href=\"https://dev.adblast.ai/settings/api-tokens\"><strong>API Tokens</strong></a> within the AdBlast dashboard and clicking <b>Generate API token</b>."
    }
  };


server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
  return { tools: toolsForClient };
});


server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    console.error(`Error: Unknown tool requested: ${toolName}`);
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});



/**
 * Type definition for cached OAuth tokens
 */
interface TokenCacheEntry {
    token: string;
    expiresAt: number;
}

/**
 * Declare global __oauthTokenCache property for TypeScript
 */
declare global {
    var __oauthTokenCache: Record<string, TokenCacheEntry> | undefined;
}

/**
 * Acquires an OAuth2 token using client credentials flow
 * 
 * @param schemeName Name of the security scheme
 * @param scheme OAuth2 security scheme
 * @returns Acquired token or null if unable to acquire
 */
async function acquireOAuth2Token(schemeName: string, scheme: any): Promise<string | null | undefined> {
    try {
        // Check if we have the necessary credentials
        const clientId = process.env[`OAUTH_CLIENT_ID_SCHEMENAME`];
        const clientSecret = process.env[`OAUTH_CLIENT_SECRET_SCHEMENAME`];
        const scopes = process.env[`OAUTH_SCOPES_SCHEMENAME`];
        
        if (!clientId || !clientSecret) {
            console.error(`Missing client credentials for OAuth2 scheme '${schemeName}'`);
            return null;
        }
        
        // Initialize token cache if needed
        if (typeof global.__oauthTokenCache === 'undefined') {
            global.__oauthTokenCache = {};
        }
        
        // Check if we have a cached token
        const cacheKey = `${schemeName}_${clientId}`;
        const cachedToken = global.__oauthTokenCache[cacheKey];
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
            console.error(`Using cached OAuth2 token for '${schemeName}' (expires in ${Math.floor((cachedToken.expiresAt - now) / 1000)} seconds)`);
            return cachedToken.token;
        }
        
        // Determine token URL based on flow type
        let tokenUrl = '';
        if (scheme.flows?.clientCredentials?.tokenUrl) {
            tokenUrl = scheme.flows.clientCredentials.tokenUrl;
            console.error(`Using client credentials flow for '${schemeName}'`);
        } else if (scheme.flows?.password?.tokenUrl) {
            tokenUrl = scheme.flows.password.tokenUrl;
            console.error(`Using password flow for '${schemeName}'`);
        } else {
            console.error(`No supported OAuth2 flow found for '${schemeName}'`);
            return null;
        }
        
        // Prepare the token request
        let formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        
        // Add scopes if specified
        if (scopes) {
            formData.append('scope', scopes);
        }
        
        console.error(`Requesting OAuth2 token from ${tokenUrl}`);
        
        // Make the token request
        const response = await axios({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            data: formData.toString()
        });
        
        // Process the response
        if (response.data?.access_token) {
            const token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
            
            // Cache the token
            global.__oauthTokenCache[cacheKey] = {
                token,
                expiresAt: now + (expiresIn * 1000) - 60000 // Expire 1 minute early
            };
            
            console.error(`Successfully acquired OAuth2 token for '${schemeName}' (expires in ${expiresIn} seconds)`);
            return token;
        } else {
            console.error(`Failed to acquire OAuth2 token for '${schemeName}': No access_token in response`);
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error acquiring OAuth2 token for '${schemeName}':`, errorMessage);
        return null;
    }
}


/**
 * Executes an API tool with the provided arguments
 *
 * @param toolName Name of the tool to execute
 * @param definition Tool definition
 * @param toolArgs Arguments provided by the user
 * @param allSecuritySchemes Security schemes from the OpenAPI spec
 * @returns Call tool result
 */
async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>
): Promise<CallToolResult> {
  try {
    // Validate arguments against the input schema
    let validatedArgs: JsonObject;
    try {
        const zodSchema = getZodSchemaFromJsonSchema(definition.inputSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}): ${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    // Prepare URL, query parameters, headers, and request body
    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    // Apply parameters to the URL path, query, or headers
    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            }
            else if (param.in === 'query') {
                queryParams[param.name] = value;
            }
            else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    // Ensure all path parameters are resolved
    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }
    
    // Construct the full URL
    const requestUrl = API_BASE_URL ? `${API_BASE_URL}${urlPath}` : urlPath;

    // Handle request body if needed
    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }


    // Apply security requirements if available
    // Security requirements use OR between array items and AND within each object
    const appliedSecurity = definition.securityRequirements?.find(req => {
        // Try each security requirement (combined with OR)
        return Object.entries(req).every(([schemeName, scopesArray]) => {
            const scheme = allSecuritySchemes[schemeName];
            if (!scheme) return false;
            
            // API Key security (header, query, cookie)
            if (scheme.type === 'apiKey') {
                return !!process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
             // HTTP security (basic, bearer)
             if (scheme.type === 'http') {
                 if (scheme.scheme?.toLowerCase() === 'bearer') {
                     // Check for token from session storage first, then env var
                     return !!(sessionStorage.getStore()?.bearerToken) || !!process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                 }
                 else if (scheme.scheme?.toLowerCase() === 'basic') {
                     return !!process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                            !!process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                 }
             }
            
            // OAuth2 security
            if (scheme.type === 'oauth2') {
                // Check for pre-existing token
                if (process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    return true;
                }
                
                // Check for client credentials for auto-acquisition
                if (process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                    process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    // Verify we have a supported flow
                    if (scheme.flows?.clientCredentials || scheme.flows?.password) {
                        return true;
                    }
                }
                
                return false;
            }
            
            // OpenID Connect
            if (scheme.type === 'openIdConnect') {
                return !!process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            return false;
        });
    });

    // If we found matching security scheme(s), apply them
    if (appliedSecurity) {
        // Apply each security scheme from this requirement (combined with AND)
        for (const [schemeName, scopesArray] of Object.entries(appliedSecurity)) {
            const scheme = allSecuritySchemes[schemeName];
            
            // API Key security
            if (scheme?.type === 'apiKey') {
                const apiKey = process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (apiKey) {
                    if (scheme.in === 'header') {
                        headers[scheme.name.toLowerCase()] = apiKey;
                        console.error(`Applied API key '${schemeName}' in header '${scheme.name}'`);
                    }
                    else if (scheme.in === 'query') {
                        queryParams[scheme.name] = apiKey;
                        console.error(`Applied API key '${schemeName}' in query parameter '${scheme.name}'`);
                    }
                    else if (scheme.in === 'cookie') {
                        // Add the cookie, preserving other cookies if they exist
                        headers['cookie'] = `${scheme.name}=${apiKey}${headers['cookie'] ? `; ${headers['cookie']}` : ''}`;
                        console.error(`Applied API key '${schemeName}' in cookie '${scheme.name}'`);
                    }
                }
            } 
             // HTTP security (Bearer or Basic)
             else if (scheme?.type === 'http') {
                 if (scheme.scheme?.toLowerCase() === 'bearer') {
                     // Get token from session storage, fall back to environment variable
                     let token = sessionStorage.getStore()?.bearerToken;
                     if (!token) {
                         token = process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                     }
                     if (token) {
                         headers['authorization'] = `Bearer ${token}`;
                         console.error(`Applied Bearer token for '${schemeName}'`);
                     }
                 }
                 else if (scheme.scheme?.toLowerCase() === 'basic') {
                     const username = process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                     const password = process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                     if (username && password) {
                         headers['authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
                         console.error(`Applied Basic authentication for '${schemeName}'`);
                     }
                 }
             }
            // OAuth2 security
            else if (scheme?.type === 'oauth2') {
                // First try to use a pre-provided token
                let token = process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                
                // If no token but we have client credentials, try to acquire a token
                if (!token && (scheme.flows?.clientCredentials || scheme.flows?.password)) {
                    console.error(`Attempting to acquire OAuth token for '${schemeName}'`);
                    token = (await acquireOAuth2Token(schemeName, scheme)) ?? '';
                }
                
                // Apply token if available
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OAuth2 token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
            // OpenID Connect
            else if (scheme?.type === 'openIdConnect') {
                const token = process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OpenID Connect token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
        }
    } 
    // Log warning if security is required but not available
    else if (definition.securityRequirements?.length > 0) {
        // First generate a more readable representation of the security requirements
        const securityRequirementsString = definition.securityRequirements
            .map(req => {
                const parts = Object.entries(req)
                    .map(([name, scopesArray]) => {
                        const scopes = scopesArray as string[];
                        if (scopes.length === 0) return name;
                        return `${name} (scopes: ${scopes.join(', ')})`;
                    })
                    .join(' AND ');
                return `[${parts}]`;
            })
            .join(' OR ');
            
        console.warn(`Tool '${toolName}' requires security: ${securityRequirementsString}, but no suitable credentials found.`);
    }
    

    // Prepare the axios request configuration
    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(), 
      url: requestUrl, 
      params: queryParams, 
      headers: headers,
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    // Log request info to stderr (doesn't affect MCP output)
    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);
    
    // Execute the request
    const response = await axios(config);

    // Process and format the response
    let responseText = '';
    const contentType = response.headers['content-type']?.toLowerCase() || '';
    
    // Handle JSON responses
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch (e) { 
             responseText = "[Stringify Error]"; 
         }
    } 
    // Handle string responses
    else if (typeof response.data === 'string') { 
         responseText = response.data; 
    }
    // Handle other response types
    else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    }
    // Handle empty responses
    else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    // Return formatted response
    return { 
        content: [ 
            { 
                type: "text", 
                text: `API Response (Status: ${response.status}):\n${responseText}` 
            } 
        ], 
    };

  } catch (error: unknown) {
    // Handle errors during execution
    let errorMessage: string;
    
    // Format Axios errors specially
    if (axios.isAxiosError(error)) { 
        errorMessage = formatApiError(error); 
    }
    // Handle standard errors
    else if (error instanceof Error) { 
        errorMessage = error.message; 
    }
    // Handle unexpected error types
    else { 
        errorMessage = 'Unexpected error: ' + String(error); 
    }
    
    // Log error to stderr
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    
    // Return error message to client
    return { content: [{ type: "text", text: errorMessage }] };
  }
}


/**
 * Main function to start the server
 */
async function main() {
// Set up StreamableHTTP transport
  try {
    await setupStreamableHttpServer(server, 3000);
  } catch (error) {
    console.error("Error setting up StreamableHTTP server:", error);
    process.exit(1);
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    console.error("Shutting down MCP server...");
    process.exit(0);
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
main().catch((error) => {
  console.error("Fatal error in main execution:", error);
  process.exit(1);
});

/**
 * Formats API errors for better readability
 * 
 * @param error Axios error
 * @returns Formatted error message
 */
function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        }
        else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        }
        else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

/**
 * Converts a JSON Schema to a Zod schema for runtime validation
 * 
 * @param jsonSchema JSON Schema
 * @param toolName Tool name for error reporting
 * @returns Zod schema
 */
function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        const zodSchema = eval(zodSchemaString);
        if (typeof zodSchema?.parse !== 'function') { 
            throw new Error('Eval did not produce a valid Zod schema.'); 
        }
        return zodSchema as z.ZodTypeAny;
    } catch (err: any) {
        console.error(`Failed to generate/evaluate Zod schema for '${toolName}':`, err);
        return z.object({}).passthrough();
    }
}
