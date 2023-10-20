package com.teger.webstorage.webstorage.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@ConfigurationProperties("encryption")
public class EncryptProperties {
    public String encrypt(String text){
        try{
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(text.getBytes());
            StringBuilder builder = new StringBuilder();
            for(byte b : md.digest()){
                builder.append(String.format("%02x", b));
            }
            return builder.toString();
        } catch(NoSuchAlgorithmException ignore){}
        return "";
    }
}
