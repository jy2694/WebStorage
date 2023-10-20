package com.teger.webstorage.webstorage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FolderUploadDTO {
    private UUID sessionKey;
    private MultipartFile[] files;
    private String path;
}
