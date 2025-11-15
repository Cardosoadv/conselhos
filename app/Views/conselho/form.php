<?= $this->extend('template/layout') ?>

<?= $this->section('content') ?>
<div class="card">
    <div class="card-header">
        <h5 class="card-title"><?= isset($conselho) ? 'Editar Conselho' : 'Novo Conselho' ?></h5>
    </div>
    <div class="card-body">
        <form action="<?= isset($conselho) ? site_url('conselho/update/' . $conselho['id']) : site_url('conselho/create') ?>" method="post">
            <?php if (isset($conselho)): ?>
                <input type="hidden" name="_method" value="put">
            <?php endif; ?>
            <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" name="nome" id="nome" class="form-control" value="<?= isset($conselho) ? $conselho['nome'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="sigla">Sigla</label>
                <input type="text" name="sigla" id="sigla" class="form-control" value="<?= isset($conselho) ? $conselho['sigla'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="sistema_profissoes">Sistema de Profissões</label>
                <input type="text" name="sistema_profissoes" id="sistema_profissoes" class="form-control" value="<?= isset($conselho) ? $conselho['sistema_profissoes'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="site">Site</label>
                <input type="text" name="site" id="site" class="form-control" value="<?= isset($conselho) ? $conselho['site'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control" value="<?= isset($conselho) ? $conselho['email'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="logradouro">Logradouro</label>
                <input type="text" name="logradouro" id="logradouro" class="form-control" value="<?= isset($conselho) ? $conselho['logradouro'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="numero">Número</label>
                <input type="text" name="numero" id="numero" class="form-control" value="<?= isset($conselho) ? $conselho['numero'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="bairro">Bairro</label>
                <input type="text" name="bairro" id="bairro" class="form-control" value="<?= isset($conselho) ? $conselho['bairro'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="cidade">Cidade</label>
                <input type="text" name="cidade" id="cidade" class="form-control" value="<?= isset($conselho) ? $conselho['cidade'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="estado">Estado</label>
                <input type="text" name="estado" id="estado" class="form-control" value="<?= isset($conselho) ? $conselho['estado'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="cep">CEP</label>
                <input type="text" name="cep" id="cep" class="form-control" value="<?= isset($conselho) ? $conselho['cep'] : '' ?>">
            </div>
            <button type="submit" class="btn btn-primary">Salvar</button>
        </form>
    </div>
</div>

<?php if (isset($conselho)): ?>
<div class="card mt-3">
    <div class="card-header">
        <h5 class="card-title">Profissões</h5>
    </div>
    <div class="card-body">
        <form action="<?= site_url('profissao/create') ?>" method="post">
            <input type="hidden" name="conselho_id" value="<?= $conselho['id'] ?>">
            <div class="form-group">
                <label for="nome">Nome da Profissão</label>
                <input type="text" name="nome" id="nome" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Adicionar Profissão</button>
        </form>

        <hr>

        <table class="table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($conselho['profissoes'] as $profissao): ?>
                    <tr>
                        <td><?= $profissao['nome'] ?></td>
                        <td>
                            <form action="<?= site_url('profissao/delete/' . $profissao['id']) ?>" method="post" class="d-inline">
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
<?php endif; ?>
<?= $this->endSection() ?>
