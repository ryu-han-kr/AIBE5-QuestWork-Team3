package com.example.QuestWork.domain.quest.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class QuestSubmissionRequestDto {

    @NotBlank
    @JsonProperty("SubmissionTitle")
    private String SubmissionTitle;

    @JsonProperty("SubmissionContent")
    private String SubmissionContent;
    private String fileUrl;
    private String repoUrl;
}
