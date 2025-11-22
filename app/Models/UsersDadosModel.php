<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Modelo responsável pela interação com a tabela de dados complementares dos usuários.
 */
class UsersDadosModel extends Model
{
    protected $table            = 'users_dados';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'user_id',
        'nome',
        'cpf',
        'data_nascimento',
        'telefone',
        'cep',
        'logradouro',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'imagem'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'user_id'         => 'required|integer',
        'nome'            => 'required|min_length[3]|max_length[100]',
        'cpf'             => 'permit_empty|min_length[11]|max_length[14]',
        'data_nascimento' => 'permit_empty|valid_date',
        'imagem'          => 'permit_empty|max_length[255]',
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];


    /**
     * Busca os dados complementares de um usuário pelo seu ID de usuário (user_id).
     *
     * @param int $userId O ID do usuário (da tabela users).
     * @return array|null Os dados do usuário ou null se não encontrado.
     */
    public function getDadosByUserId($userId)
    {
        return $this->where('user_id', $userId)->first();
    }

    /**
     * Busca um registro pelo ID, fazendo join com a tabela de usuários.
     *
     * @param int|string|null $id O ID do registro em users_dados.
     * @return array|null O registro encontrado ou null.
     */
    public function find($id = null)
    {
        $this->join('users', 'users.id = users_dados.user_id');
        return parent::find($id);
    }

    /**
     * Busca todos os registros, fazendo join com a tabela de usuários e identidades.
     *
     * @param int|null $limit Limite de registros.
     * @param int $offset Deslocamento.
     * @return array Lista de registros encontrados.
     */
    public function findAll(?int $limit = null, int $offset = 0)
    {
        // Seleciona dados de users_dados (pode ser null), e dados obrigatórios de users
        $this->select('users_dados.*, users.id as user_real_id, users.username, auth_identities.secret as e-mail')
            ->join('users', 'users.id = users_dados.user_id', 'right') // Right join para pegar todos os users
            ->join('auth_identities', 'auth_identities.user_id = users.id', 'left'); // Left join para identidades (pode não ter?) Geralmente tem.

        return parent::findAll($limit, $offset);
    }
}
