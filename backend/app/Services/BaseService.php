<?php

namespace App\Services;

use App\Repositories\Contracts\RepositoryInterface;

abstract class BaseService
{
    protected RepositoryInterface $repository;

    public function __construct(RepositoryInterface $repository)
    {
        $this->repository = $repository;
    }
}
