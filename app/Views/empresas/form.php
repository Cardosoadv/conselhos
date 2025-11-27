<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2"><?= esc($titulo) ?></h1>
    <div class="btn-toolbar mb-2 mb-md-0">
        <a href="<?= site_url('empresas') ?>" class="btn btn-sm btn-outline-secondary">
            Voltar
        </a>
    </div>
</div>

<?php if (session()->has('errors')): ?>
    <div class="alert alert-danger">
        <ul>
        <?php foreach (session('errors') as $error): ?>
            <li><?= esc($error) ?></li>
        <?php endforeach ?>
        </ul>
    </div>
<?php endif; ?>

<?php if (session()->has('error')): ?>
    <div class="alert alert-danger">
        <?= session('error') ?>
    </div>
<?php endif; ?>

<?php
    $action = isset($empresa) ? 'empresas/update/' . $empresa['id'] : 'empresas/create';
?>

<form action="<?= site_url($action) ?>" method="post" enctype="multipart/form-data">
    <?= csrf_field() ?>

    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="razao_social" class="form-label">Razão Social</label>
            <input type="text" class="form-control" id="razao_social" name="razao_social" value="<?= old('razao_social', $empresa['razao_social'] ?? '') ?>" required>
        </div>

        <div class="col-md-6 mb-3">
            <label for="nome_fantasia" class="form-label">Nome Fantasia</label>
            <input type="text" class="form-control" id="nome_fantasia" name="nome_fantasia" value="<?= old('nome_fantasia', $empresa['nome_fantasia'] ?? '') ?>">
        </div>
    </div>

    <div class="row">
        <div class="col-md-4 mb-3">
            <label for="cnpj" class="form-label">CNPJ</label>
            <input type="text" class="form-control" id="cnpj" name="cnpj" value="<?= old('cnpj', $empresa['cnpj'] ?? '') ?>" required placeholder="Apenas números">
            <small class="text-muted">Informe 14 dígitos.</small>
        </div>

        <div class="col-md-4 mb-3">
            <label for="telefone" class="form-label">Telefone</label>
            <input type="text" class="form-control" id="telefone" name="telefone" value="<?= old('telefone', $empresa['telefone'] ?? '') ?>">
        </div>

        <div class="col-md-4 mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input type="email" class="form-control" id="email" name="email" value="<?= old('email', $empresa['email'] ?? '') ?>">
        </div>
    </div>

    <div class="mb-3">
        <label for="endereco" class="form-label">Endereço</label>
        <textarea class="form-control" id="endereco" name="endereco" rows="3"><?= old('endereco', $empresa['endereco'] ?? '') ?></textarea>
    </div>

    <div class="mb-3">
        <label for="logo" class="form-label">Logo</label>
        <?php if (!empty($empresa['logo'])): ?>
            <div class="mb-2">
                <img src="<?= site_url('empresas/logo/' . $empresa['id']) ?>" alt="Logo Atual" width="100" class="img-thumbnail">
            </div>
        <?php endif; ?>
        <input class="form-control" type="file" id="logo" name="logo" accept="image/*">
    </div>

    <button type="submit" class="btn btn-primary">Salvar</button>
</form>

<?= $this->endSection() ?>
