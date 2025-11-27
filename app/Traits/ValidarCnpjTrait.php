<?php

namespace App\Traits;

/**
 * Trait ValidarCnpjTrait
 *
 * Fornece funcionalidades para validação de CNPJ.
 */
trait ValidarCnpjTrait
{
    /**
     * Valida um número de CNPJ.
     *
     * Verifica se o CNPJ possui 14 dígitos, se não é uma sequência repetida
     * e valida os dígitos verificadores.
     *
     * @param string|null $cnpj O CNPJ a ser validado.
     * @return bool True se o CNPJ for válido, false caso contrário.
     */
    public function validaCnpj(?string $cnpj): bool
    {
        if (empty($cnpj)) {
            return false;
        }

        // Extrai somente os números
        $cnpj = preg_replace('/[^0-9]/is', '', $cnpj);

        // Verifica se foi informado todos os digitos corretamente
        if (strlen($cnpj) != 14) {
            return false;
        }

        // Verifica se foi informada uma sequência de digitos repetidos
        if (preg_match('/(\d)\1{13}/', $cnpj)) {
            return false;
        }

        // Valida primeiro dígito verificador
        for ($i = 0, $j = 5, $soma = 0; $i < 12; $i++) {
            $soma += $cnpj[$i] * $j;
            $j = ($j == 2) ? 9 : $j - 1;
        }
        $resto = $soma % 11;
        if ($cnpj[12] != ($resto < 2 ? 0 : 11 - $resto)) {
            return false;
        }

        // Valida segundo dígito verificador
        for ($i = 0, $j = 6, $soma = 0; $i < 13; $i++) {
            $soma += $cnpj[$i] * $j;
            $j = ($j == 2) ? 9 : $j - 1;
        }
        $resto = $soma % 11;
        return $cnpj[13] == ($resto < 2 ? 0 : 11 - $resto);
    }
}
