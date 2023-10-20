package com.teger.webstorage.webstorage.service;

import com.teger.webstorage.webstorage.entity.Member;
import com.teger.webstorage.webstorage.properties.FileProperties;
import com.teger.webstorage.webstorage.repository.FileRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FileProperties fileProperties;

    public Map<String, Map<String, String>> getFileList(Member member, String path) throws IOException {
        Map<String, Map<String, String>> filelist = new HashMap<>();
        for(Path p : fileProperties.getPathList(member, path)){
            File file = p.toFile();
            String originName = file.getName();
            Optional<com.teger.webstorage.webstorage.entity.File> optionalDbfile = fileRepository.findByOwnerAndOriginName(member.getId(), originName);
            if(optionalDbfile.isEmpty()) continue;
            com.teger.webstorage.webstorage.entity.File dbfile = optionalDbfile.get();
            Map<String, String> data = new HashMap<>();
            data.put("origin", originName);
            data.put("type", file.isFile() ? "file" : "directory");
            if(file.isFile())
                data.put("extension", originName.substring(originName.lastIndexOf(".")));
            data.put("fileSize", Long.toString(dbfile.getFileSize()));
            filelist.put(dbfile.getFileName(), data);
        }
        return filelist;
    }
}
