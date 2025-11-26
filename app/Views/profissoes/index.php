<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">Profissões</h5>
        <?php if (auth()->user()->can('profissoes.criar')): ?>
            <a href="<?= site_url('profissoes/new') ?>" class="btn btn-primary btn-sm">Nova Profissão</a>
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
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($profissoes) && is_array($profissoes)): ?>
                        <?php foreach ($profissoes as $profissao): ?>
                            <tr>
                                <td><?= esc($profissao['id']) ?></td>
                                <td><?= esc($profissao['nome']) ?></td>
                                <td><?= esc($profissao['descricao']) ?></td>
                                <td>
                                    <?php if (auth()->user()->can('profissoes.editar')): ?>
                                        <a href="<?= site_url('profissoes/edit/' . $profissao['id']) ?>" class="btn btn-warning btn-sm">Editar</a>
                                    <?php endif; ?>
                                    <?php if (auth()->user()->can('profissoes.excluir')): ?>
                                        <a href="<?= site_url('profissoes/delete/' . $profissao['id']) ?>" class="btn btn-danger btn-sm" onclick="return confirm('Tem certeza que deseja excluir esta profissão?')">Excluir</a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="4" class="text-center">Nenhuma profissão encontrada.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?= $this->endSection() ?>