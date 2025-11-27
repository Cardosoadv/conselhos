<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2"><?= esc($titulo) ?></h1>
    <div class="btn-toolbar mb-2 mb-md-0">
        <?php if (auth()->user()->can('empresas.criar')): ?>
            <a href="<?= site_url('empresas/new') ?>" class="btn btn-sm btn-outline-primary">
                Nova Empresa
            </a>
        <?php endif; ?>
    </div>
</div>

<?php if (session()->has('message')): ?>
    <div class="alert alert-success">
        <?= session('message') ?>
    </div>
<?php endif; ?>

<?php if (session()->has('error')): ?>
    <div class="alert alert-danger">
        <?= session('error') ?>
    </div>
<?php endif; ?>

<div class="table-responsive">
    <table class="table table-striped table-sm">
        <thead>
            <tr>
                <th>ID</th>
                <th>Logo</th>
                <th>Razão Social</th>
                <th>Nome Fantasia</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <?php if (!empty($empresas) && is_array($empresas)): ?>
                <?php foreach ($empresas as $empresa): ?>
                    <tr>
                        <td><?= esc($empresa['id']) ?></td>
                        <td>
                            <?php if (!empty($empresa['logo'])): ?>
                                <img src="<?= site_url('empresas/logo/' . $empresa['id']) ?>" alt="Logo" width="40" height="40" class="rounded-circle">
                            <?php else: ?>
                                <span class="text-muted">Sem logo</span>
                            <?php endif; ?>
                        </td>
                        <td><?= esc($empresa['razao_social']) ?></td>
                        <td><?= esc($empresa['nome_fantasia']) ?></td>
                        <td><?= esc($empresa['cnpj']) ?></td>
                        <td><?= esc($empresa['telefone']) ?></td>
                        <td><?= esc($empresa['email']) ?></td>
                        <td>
                            <?php if (auth()->user()->can('empresas.editar')): ?>
                                <a href="<?= site_url('empresas/edit/' . $empresa['id']) ?>" class="btn btn-sm btn-primary">Editar</a>
                            <?php endif; ?>

                            <?php if (auth()->user()->can('empresas.excluir')): ?>
                                <a href="<?= site_url('empresas/delete/' . $empresa['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Tem certeza que deseja excluir esta empresa?');">Excluir</a>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="8" class="text-center">Nenhuma empresa encontrada.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?= $this->endSection() ?>
