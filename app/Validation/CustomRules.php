<?php

namespace App\Validation;

use App\Traits\ValidarCnpjTrait;
use App\Traits\ValidarCpfTrait;

/**
 * Classe CustomRules
 *
 * Define regras de validação customizadas para o CodeIgniter.
 */
class CustomRules
{
    use ValidarCpfTrait;
    use ValidarCnpjTrait;

    /**
     * Regra de validação customizada para CPF.
     *
     * Utiliza a trait ValidarCpfTrait para verificar a validade do CPF.
     *
     * @param string $str O valor do campo a ser validado.
     * @param string|null $error Variável para retornar mensagem de erro (opcional).
     * @return bool True se o CPF for válido, false caso contrário.
     */
    public function valid_cpf(string $str, ?string &$error = null): bool
    {
        return $this->validaCpf($str);
    }

    /**
     * Regra de validação customizada para CNPJ.
     *
     * Utiliza a trait ValidarCnpjTrait para verificar a validade do CNPJ.
     *
     * @param string $str O valor do campo a ser validado.
     * @param string|null $error Variável para retornar mensagem de erro (opcional).
     * @return bool True se o CNPJ for válido, false caso contrário.
     */
    public function valid_cnpj(string $str, ?string &$error = null): bool
    {
        return $this->validaCnpj($str);
    }
}
