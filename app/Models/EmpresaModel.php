<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Traits\ValidarCnpjTrait;

/**
 * Modelo para a tabela de Empresas.
 */
class EmpresaModel extends Model
{
    use ValidarCnpjTrait;

    protected $table            = 'empresas';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'razao_social',
        'nome_fantasia',
        'cnpj',
        'email',
        'telefone',
        'endereco',
        'logo',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Regras de validação
    protected $validationRules = [
        'razao_social' => 'required|min_length[3]|max_length[255]',
        'cnpj'         => 'required|exact_length[14]|is_unique[empresas.cnpj,id,{id}]|validaCnpj',
        'email'        => 'permit_empty|valid_email|max_length[255]',
        'telefone'     => 'permit_empty|max_length[20]',
    ];

    protected $validationMessages = [
        'razao_social' => [
            'required' => 'A razão social é obrigatória.',
        ],
        'cnpj' => [
            'required'    => 'O CNPJ é obrigatório.',
            'is_unique'   => 'Este CNPJ já está cadastrado.',
            'exact_length'=> 'O CNPJ deve ter 14 dígitos.',
            'validaCnpj'  => 'CNPJ inválido.',
        ],
        'email' => [
            'valid_email' => 'Por favor, insira um e-mail válido.',
        ],
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['limpaCnpj'];
    protected $beforeUpdate   = ['limpaCnpj'];

    /**
     * Callback para limpar o CNPJ antes de salvar (deixar apenas números).
     *
     * @param array $data
     * @return array
     */
    protected function limpaCnpj(array $data)
    {
        if (isset($data['data']['cnpj'])) {
            $data['data']['cnpj'] = preg_replace('/[^0-9]/', '', $data['data']['cnpj']);
        }
        return $data;
    }
}
