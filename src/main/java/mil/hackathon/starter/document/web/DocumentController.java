package mil.hackathon.starter.document.web;

import lombok.AllArgsConstructor;
import mil.hackathon.starter.document.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@AllArgsConstructor
public class DocumentController {
    DocumentService documentService;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getDocumentById(@PathVariable Long id) {
        Resource resource = documentService.getDocumentById(id);

        if (!resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFilename());

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    @PostMapping("/idea/{ideaId}")
    public ResponseEntity<Void> addDocument(@RequestParam("file") MultipartFile file, @PathVariable Long ideaId) {
        documentService.addDocument(file, ideaId);
        return ResponseEntity.ok().build();
    }
}
