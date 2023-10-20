package com.teger.webstorage.webstorage.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ConfigurationProperties("session")
public class SessionProperties {
    private final Map<UUID, Long> sessionKey = new ConcurrentHashMap<>();

    public UUID createSession(Long memberId){
        UUID sessionKey = UUID.randomUUID();
        if(this.sessionKey.containsValue(memberId)){
            List<UUID> existSession = new ArrayList<>();
            for(Map.Entry<UUID, Long> entry : this.sessionKey.entrySet()){
                if(entry.getValue().equals(memberId)){
                    existSession.add(entry.getKey());
                }
            }
            existSession.forEach(this::expireSessionKey);
        }
        this.sessionKey.put(sessionKey, memberId);
        return sessionKey;
    }

    public Long findUserBySessionKey(UUID sessionKey){
        return this.sessionKey.get(sessionKey);
    }

    public void expireSessionKey(UUID sessionKey){
        this.sessionKey.remove(sessionKey);
    }
}
