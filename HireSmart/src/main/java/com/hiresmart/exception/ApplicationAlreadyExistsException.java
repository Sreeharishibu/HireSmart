package com.hiresmart.exception;

public class ApplicationAlreadyExistsException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ApplicationAlreadyExistsException(String message) {
        super(message);
    }
}  