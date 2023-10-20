package com.teger.webstorage.webstorage.repository;

import com.teger.webstorage.webstorage.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    Optional<File> findByOwnerAndOriginName(Long owner, String originName);
}
