<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">Profissionais</h5>
        <?php if (auth()->user()->can('profissionais.criar')): ?>
            <a href="<?= site_url('profissionais/new') ?>" class="btn btn-primary btn-sm">Novo Profissional</a>
        <?php endif; ?>
    </div>
    <div class="card-body">
        <?php if (session()->getFlashdata('message')): ?>
            <div class="alert alert-success">
                <?= session()->getFlashdata('message') ?>
            </div>
        <?php endif; ?>
        <?php if (session()->getFlashdata('error')): ?>
            <div class="alert alert-danger">
                <?= session()->getFlashdata('error') ?>
            </div>
        <?php endif; ?>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Registro</th>
                        <th>CPF</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($profissionais) && is_array($profissionais)): ?>
                        <?php foreach ($profissionais as $profissional): ?>
                            <tr>
                                <td><?= esc($profissional['id']) ?></td>
                                <td>
                                    <?php if (!empty($profissional['foto'])): ?>
                                        <img src="<?= site_url('profissionais/foto/' . $profissional['id']) ?>" alt="Foto" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
                                    <?php else: ?>
                                        <span class="text-muted">Sem foto</span>
                                    <?php endif; ?>
                                </td>
                                <td><?= esc($profissional['nome']) ?></td>
                                <td><?= esc($profissional['numero_registro']) ?></td>
                                <td><?= esc($profissional['cpf']) ?></td>
                                <td><?= esc($profissional['email']) ?></td>
                                <td>
                                    <?php if (auth()->user()->can('profissionais.editar')): ?>
                                        <a href="<?= site_url('profissionais/edit/' . $profissional['id']) ?>" class="btn btn-warning btn-sm">Editar</a>
                                    <?php endif; ?>
                                    <?php if (auth()->user()->can('profissionais.excluir')): ?>
                                        <a href="<?= site_url('profissionais/delete/' . $profissional['id']) ?>" class="btn btn-danger btn-sm" onclick="return confirm('Tem certeza que deseja excluir este profissional?')">Excluir</a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="7" class="text-center">Nenhum profissional encontrado.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?= $this->endSection() ?>