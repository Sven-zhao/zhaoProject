package com.zhaoProject.springBoot.service.impl;


import com.zhaoProject.springBoot.dao.PrizeBaseMapper;
import com.zhaoProject.springBoot.domain.PrizeBase;
import com.zhaoProject.springBoot.service.PrizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("PrizeService")
public class PrizeServiceImpl implements PrizeService {

    @Autowired
    PrizeBaseMapper prizeDao;

    @Override
    public PrizeBase getOne() {
        return prizeDao.selectByPrimaryKey(1);
    }

    @Override
    public PrizeBase getById(int id) {
        return prizeDao.getById(id);
    }


}
