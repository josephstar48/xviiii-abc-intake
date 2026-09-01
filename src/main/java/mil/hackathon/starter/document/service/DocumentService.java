package mil.hackathon.starter.document.service;

import lombok.extern.slf4j.Slf4j;
import mil.hackathon.starter.document.db.Document;
import mil.hackathon.starter.document.db.DocumentRepository;
import mil.hackathon.starter.idea.db.IdeaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class DocumentService {
    DocumentRepository documentRepository;
    IdeaRepository ideaRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DocumentService(DocumentRepository documentRepository, IdeaRepository ideaRepository) {
        this.documentRepository = documentRepository;
        this.ideaRepository = ideaRepository;
    }

    public void addDocument(MultipartFile file, Long ideaId) {
        try {
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            Document savedDocument = documentRepository.save(Document.builder()
                    .name(fileName)
                    .path(filePath.toString())
                    .build());

            ideaRepository.findById(ideaId).ifPresent(idea -> {
                List<Document> documents = idea.getDocuments();
                documents.add(savedDocument);
                idea.setDocuments(documents);
                ideaRepository.save(idea);
            });

        } catch (Exception e) {
            e.printStackTrace();
            log.info(String.format("Failed to upload file with name %s", file.getOriginalFilename()));
        }
    }

    public Resource getDocumentById(Long id) {
        Resource resource = null;

        try {
            Optional<Document> document = documentRepository.findById(id);
            log.info(document.get().getName());
            if (document.isPresent()) {
                Path filePath = Paths.get(uploadDir).resolve(document.get().getName()).normalize();
                resource = new FileSystemResource(filePath.toFile());
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.info(String.format("Failed to retrieve file with id %d", id));
        }

        return resource;
    }
}
