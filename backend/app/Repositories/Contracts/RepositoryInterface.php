<?php

namespace App\Repositories\Contracts;

interface RepositoryInterface
{
    public function findById(int $id);
    
    public function findByUuid(string $uuid);
    
    public function findAll(array $columns = ['*']);
    
    public function create(array $data);
    
    public function update(int $id, array $data);
    
    public function delete(int $id): bool;
    
    public function paginate(int $perPage = 15, array $columns = ['*']);
}
