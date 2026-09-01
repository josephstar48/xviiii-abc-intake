package mil.hackathon.starter.ai.web;

public record IdeaDraftResponse(
        String title,
        String problemStatement,
        String problemContext,
        String solutionBenefits,
        String solutionConcepts
) {
}
