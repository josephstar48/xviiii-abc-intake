package mil.hackathon.starter.ai.web;

import lombok.AllArgsConstructor;
import mil.hackathon.starter.ai.service.GeminiIdeaDraftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@AllArgsConstructor
public class AiController {
    GeminiIdeaDraftService geminiIdeaDraftService;

    @PostMapping("/structure-idea")
    public ResponseEntity<IdeaDraftResponse> structureIdea(@RequestBody IdeaDraftRequest request) {
        return ResponseEntity.ok(geminiIdeaDraftService.draftIdea(request.prompt()));
    }
}
