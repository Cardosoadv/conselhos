<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card">
    <div class="card-header">
        <h5 class="card-title">Conselhos</h5>
    </div>
    <div class="card-body">
        <a href="<?= site_url('conselho/new') ?>" class="btn btn-primary mb-3">Novo Conselho</a>
        <table class="table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Sigla</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($conselhos as $conselho): ?>
                    <tr>
                        <td><?= $conselho['nome'] ?></td>
                        <td><?= $conselho['sigla'] ?></td>
                        <td>
                            <a href="<?= site_url('conselho/edit/' . $conselho['id']) ?>" class="btn btn-sm btn-warning">Editar</a>
                            <form action="<?= site_url('conselho/delete/' . $conselho['id']) ?>" method="post" class="d-inline">
                                <input type="hidden" name="_method" value="delete">
                                <button type="submit" class="btn btn-sm btn-danger">Excluir</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?= $this->endSection() ?>
