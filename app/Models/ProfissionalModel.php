<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Traits\ValidarCpfTrait;

class ProfissionalModel extends Model
{
    use ValidarCpfTrait;

    protected $table            = 'profissionais';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'nome',
        'cpf',
        'email',
        'telefone',
        'numero_registro',
        'foto'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'nome'            => 'required|min_length[3]|max_length[100]',
        'cpf'             => 'required|min_length[11]|max_length[14]|valid_cpf',
        'email'           => 'permit_empty|valid_email|max_length[255]',
        'numero_registro' => 'required|is_unique[profissionais.numero_registro,id,{id}]',
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    /**
     * Retorna as profissões associadas a este profissional.
     */
    public function getProfissoes($profissionalId)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('profissionais_profissoes');
        $builder->select('profissoes.*');
        $builder->join('profissoes', 'profissoes.id = profissionais_profissoes.profissao_id');
        $builder->where('profissionais_profissoes.profissional_id', $profissionalId);
        return $builder->get()->getResultArray();
    }

    /**
     * Sincroniza as profissões de um profissional.
     */
    public function syncProfissoes($profissionalId, array $profissoesIds)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('profissionais_profissoes');

        // Remove todas as associações atuais
        $builder->where('profissional_id', $profissionalId)->delete();

        // Adiciona as novas
        if (!empty($profissoesIds)) {
            $data = [];
            foreach ($profissoesIds as $profissaoId) {
                $data[] = [
                    'profissional_id' => $profissionalId,
                    'profissao_id'    => $profissaoId,
                ];
            }
            $builder->insertBatch($data);
        }
    }
}
