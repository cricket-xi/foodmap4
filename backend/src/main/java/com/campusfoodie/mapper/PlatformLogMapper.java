package com.campusfoodie.mapper;

import com.campusfoodie.model.PlatformLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlatformLogMapper {
    List<PlatformLog> findAll();
    List<PlatformLog> findByActorRole(@Param("actorRole") String actorRole);
    int insert(PlatformLog platformLog);
}
