<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Modelo responsável pela interação com a tabela de atribuições.
 */
class AtribuicaoModel extends Model
{
    protected $table            = 'atribuicoes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = ['nome', 'requisitos'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'nome' => 'required|min_length[3]|max_length[255]|is_unique[atribuicoes.nome,id,{id}]',
        'requisitos' => 'required',
    ];
    protected $validationMessages   = [
        'nome' => [
            'required' => 'O campo Nome é obrigatório.',
            'min_length' => 'O Nome deve ter pelo menos 3 caracteres.',
            'max_length' => 'O Nome não pode exceder 255 caracteres.',
            'is_unique' => 'Esta Atribuição já está cadastrada.',
        ],
        'requisitos' => [
            'required' => 'O campo Requisitos é obrigatório.',
        ],
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}
