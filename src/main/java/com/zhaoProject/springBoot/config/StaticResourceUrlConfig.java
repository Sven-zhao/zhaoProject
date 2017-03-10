package com.zhaoProject.springBoot.config;

import com.zhaoProject.springBoot.common.Contants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.resource.ResourceUrlProvider;

import javax.annotation.PostConstruct;

@ControllerAdvice
public class StaticResourceUrlConfig {

    @Autowired
    private ResourceUrlProvider resourceUrlProvider;

    @Autowired
    private Contants contants;

    private ResourceUrlProviderWithDomain resourceUrlProviderWithDomain;

    @PostConstruct
    public void init() {
        this.resourceUrlProviderWithDomain = new ResourceUrlProviderWithDomain(this.contants.staticDomain, this.resourceUrlProvider);
    }

    @ModelAttribute("urls")
    public ResourceUrlProviderWithDomain urls() {
        return this.resourceUrlProviderWithDomain;
    }

    public static class ResourceUrlProviderWithDomain {
        private final ResourceUrlProvider resourceUrlProvider;
        private final String domain;

        ResourceUrlProviderWithDomain(String domain, ResourceUrlProvider resourceUrlProvider) {
            this.resourceUrlProvider = resourceUrlProvider;
            this.domain = domain;
        }

        public String getForLookupPath(String path) {
            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append("http://");
            stringBuffer.append(this.domain);
            String pathWitMd5 = resourceUrlProvider.getForLookupPath(path);
            if (pathWitMd5.startsWith("/")) {
                stringBuffer.append(pathWitMd5);
            } else {
                stringBuffer.append("/").append(pathWitMd5);
            }
            return stringBuffer.toString();
        }
    }
}
