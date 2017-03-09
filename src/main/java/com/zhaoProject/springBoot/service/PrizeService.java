package com.zhaoProject.springBoot.service;

import com.zhaoProject.springBoot.domain.PrizeBase;

public interface PrizeService {

    PrizeBase getOne();

    PrizeBase getById(int id);
}
