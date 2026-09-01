package mil.hackathon.starter.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import mil.hackathon.starter.ai.web.IdeaDraftResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiIdeaDraftService {
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${gemini.api-key}")
    String apiKey;

    @Value("${gemini.model}")
    String model;

    public IdeaDraftResponse draftIdea(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "GEMINI_API_KEY is not configured");
        }

        try {
            String response = sendGeminiRequest(prompt);
            return parseDraft(response);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini request was interrupted", e);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini request failed", e);
        }
    }

    private String sendGeminiRequest(String prompt) throws IOException, InterruptedException {
        String instruction = """
                Return only a JSON object with these string fields:
                title, problemStatement, problemContext, solutionBenefits, solutionConcepts.
                Draft it for a Dragon Spark XVIII Airborne Corps innovation intake submission.
                Problem:
                """ + prompt;

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", instruction))
                )),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
                )
        );

        String encodedModel = URLEncoder.encode(model, StandardCharsets.UTF_8);
        URI uri = URI.create("https://generativelanguage.googleapis.com/v1beta/models/" + encodedModel + ":generateContent");
        HttpRequest request = HttpRequest.newBuilder(uri)
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini returned status " + response.statusCode());
        }
        return response.body();
    }

    private IdeaDraftResponse parseDraft(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode textNode = root.at("/candidates/0/content/parts/0/text");
        if (textNode.isMissingNode() || textNode.asText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini returned no draft text");
        }

        String draftJson = textNode.asText()
                .replace("```json", "")
                .replace("```", "")
                .trim();
        return objectMapper.readValue(draftJson, IdeaDraftResponse.class);
    }
}
