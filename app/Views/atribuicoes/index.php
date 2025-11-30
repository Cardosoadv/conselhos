<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">Atribuições</h5>
        <?php if (auth()->user()->can('atribuicoes.criar')): ?>
            <a href="<?= site_url('atribuicoes/new') ?>" class="btn btn-primary btn-sm">Nova Atribuição</a>
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
                        <th>Requisitos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($atribuicoes) && is_array($atribuicoes)): ?>
                        <?php foreach ($atribuicoes as $atribuicao): ?>
                            <tr>
                                <td><?= esc($atribuicao['id']) ?></td>
                                <td><?= esc($atribuicao['nome']) ?></td>
                                <td><?= esc($atribuicao['requisitos']) ?></td>
                                <td>
                                    <?php if (auth()->user()->can('atribuicoes.editar')): ?>
                                        <a href="<?= site_url('atribuicoes/edit/' . $atribuicao['id']) ?>" class="btn btn-warning btn-sm">Editar</a>
                                    <?php endif; ?>
                                    <?php if (auth()->user()->can('atribuicoes.excluir')): ?>
                                        <a href="<?= site_url('atribuicoes/delete/' . $atribuicao['id']) ?>" class="btn btn-danger btn-sm" onclick="return confirm('Tem certeza que deseja excluir esta atribuição?')">Excluir</a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="4" class="text-center">Nenhuma atribuição encontrada.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?= $this->endSection() ?>
