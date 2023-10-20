package com.teger.webstorage.webstorage.properties;

import com.teger.webstorage.webstorage.entity.Member;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@ConfigurationProperties("file")
@Getter
public class FileProperties {
    private final String SYSTEM_ROOT = "storage";

    public Path getUserRoot(Member member) throws IOException {
        Path path = Paths.get(SYSTEM_ROOT + "/" + member.getId());
        if(!path.toFile().exists())
            Files.createDirectory(Paths.get(SYSTEM_ROOT + "/" + member.getId()));
        return path;
    }

    public Path[] getPathList(Member member, String path) throws IOException {
        if(!Files.exists(toUserPath(member, path))){
            return new Path[0];
        }
        return Files.list(toUserPath(member, path)).toArray(Path[]::new);
    }

    public Path toUserPath(Member member, String path) throws IOException {
        getUserRoot(member);
        return Paths.get(SYSTEM_ROOT + "/" + member.getId() + (path.startsWith("/") ? path : ("/" + path)));
    }
}
