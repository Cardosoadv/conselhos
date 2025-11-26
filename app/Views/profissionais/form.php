<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card card-primary card-outline">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">
            <i class="fas fa-user-tie me-2"></i>
            <?= isset($profissional) ? 'Editar' : 'Novo' ?> Profissional
        </h3>
        <a href="<?= site_url('profissionais') ?>" class="btn btn-secondary btn-sm"><i class="fas fa-arrow-left me-1"></i> Voltar</a>
    </div>
    <div class="card-body">
        <?php if (session()->getFlashdata('errors')): ?>
            <div class="alert alert-danger">
                <ul class="mb-0">
                    <?php foreach (session()->getFlashdata('errors') as $error): ?>
                        <li><?= esc($error) ?></li>
                    <?php endforeach ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php
        $action = isset($profissional) ? site_url('profissionais/update/' . $profissional['id']) : site_url('profissionais/create');
        ?>

        <form action="<?= $action ?>" method="post" enctype="multipart/form-data">
            <?= csrf_field() ?>

            <h5 class="mb-3 border-bottom pb-2"><i class="fas fa-info-circle me-2"></i>Dados Pessoais</h5>

            <div class="row g-3">
                <div class="col-md-6">
                    <label for="nome" class="form-label">Nome Completo</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-user"></i></span>
                        <input type="text" class="form-control" id="nome" name="nome" value="<?= old('nome', $profissional['nome'] ?? '') ?>" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="cpf" class="form-label">CPF</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                        <input type="text" class="form-control" id="cpf" name="cpf" value="<?= old('cpf', $profissional['cpf'] ?? '') ?>" required>
                    </div>
                </div>
            </div>

            <div class="row g-3 mt-1">
                <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                        <input type="email" class="form-control" id="email" name="email" value="<?= old('email', $profissional['email'] ?? '') ?>">
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="telefone" class="form-label">Telefone</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-phone"></i></span>
                        <input type="text" class="form-control" id="telefone" name="telefone" value="<?= old('telefone', $profissional['telefone'] ?? '') ?>">
                    </div>
                </div>
            </div>

            <h5 class="mt-4 mb-3 border-bottom pb-2"><i class="fas fa-briefcase me-2"></i>Dados Profissionais</h5>

            <div class="row g-3">
                <div class="col-md-6">
                    <label for="numero_registro" class="form-label">Número de Registro</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                        <input type="text" class="form-control" id="numero_registro" name="numero_registro" value="<?= old('numero_registro', $profissional['numero_registro'] ?? '') ?>" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="foto" class="form-label">Foto</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-camera"></i></span>
                        <input type="file" class="form-control" id="foto" name="foto" accept="image/*">
                    </div>
                    <?php if (!empty($profissional['foto'])): ?>
                        <div class="mt-2">
                            <small>Foto Atual:</small><br>
                            <img src="<?= site_url('profissionais/foto/' . $profissional['id']) ?>" alt="Foto Atual" class="img-thumbnail" style="width: 100px;">
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="mb-3 mt-3">
                <label class="form-label"><i class="fas fa-tags me-1"></i> Profissões</label>
                <div class="card p-3" style="max-height: 200px; overflow-y: auto;">
                    <?php
                    $selectedProfissoes = old('profissoes', $profissoesAssociadas ?? []);
                    ?>
                    <?php if (!empty($profissoes)): ?>
                        <?php foreach ($profissoes as $profissao): ?>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="profissoes[]" value="<?= $profissao['id'] ?>" id="prof_<?= $profissao['id'] ?>"
                                    <?= in_array($profissao['id'], $selectedProfissoes) ? 'checked' : '' ?>>
                                <label class="form-check-label" for="prof_<?= $profissao['id'] ?>">
                                    <?= esc($profissao['nome']) ?>
                                </label>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-muted">Nenhuma profissão cadastrada.</p>
                    <?php endif; ?>
                </div>
            </div>

            <div class="mt-4 text-end">
                <button type="submit" class="btn btn-success"><i class="fas fa-save me-1"></i> Salvar</button>
            </div>
        </form>
    </div>
</div>
<?= $this->endSection() ?>