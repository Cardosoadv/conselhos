<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card card-primary card-outline">
    <div class="card-header">
        <h3 class="card-title">
            <i class="fas fa-user-edit me-2"></i>
            <?= isset($usuario['user_id']) ? 'Editar Dados do Usuário' : 'Novo Usuário' ?>
        </h3>
    </div>
    <div class="card-body">
        <?php if (session()->getFlashdata('errors')): ?>
            <div class="alert alert-danger">
                <ul class="mb-0">
                    <?php foreach (session()->getFlashdata('errors') as $error): ?>
                        <li><?= esc($error) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form action="<?= isset($usuario['user_id']) ? site_url('usuarios/' . $usuario['user_id']) : site_url('usuarios') ?>" method="post" enctype="multipart/form-data">
            <?php if (isset($usuario['user_id'])): ?>
                <input type="hidden" name="_method" value="PUT">
            <?php endif; ?>

            <h5 class="mb-3 border-bottom pb-2"><i class="fas fa-id-card me-2"></i>Dados Pessoais</h5>

            <div class="row g-3">
                <div class="col-md-6">
                    <label for="user_id" class="form-label">ID do Usuário (Shield)</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-key"></i></span>
                        <input type="number" name="user_id" id="user_id" class="form-control" value="<?= isset($usuario['user_id']) ? esc($usuario['user_id']) : '' ?>" readonly>
                    </div>
                    <div class="form-text">ID do usuário na tabela users do Shield.</div>
                </div>
                <div class="col-md-6">
                    <label for="imagem" class="form-label">Foto de Perfil</label>
                    <div class="input-group">
                        <input type="file" name="imagem" id="imagem" class="form-control" accept="image/*">
                    </div>
                    <?php if (isset($usuario) && !empty($usuario['imagem'])): ?>
                        <div class="mt-2">
                            <img src="<?= site_url('usuarios/imagem/' . $usuario['user_id'] . '/' . $usuario['imagem']) ?>" alt="Atual" class="img-thumbnail" style="height: 100px;">
                        </div>
                    <?php endif; ?>
                </div>

                <div class="col-md-8">
                    <label for="nome" class="form-label">Nome Completo</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-user"></i></span>
                        <input type="text" name="nome" id="nome" class="form-control" value="<?= isset($usuario['nome']) ? esc($usuario['nome']) : '' ?>" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="cpf" class="form-label">CPF</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-fingerprint"></i></span>
                        <input type="text" name="cpf" id="cpf" class="form-control" value="<?= isset($usuario['cpf']) ? esc($usuario['cpf']) : '' ?>">
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="data_nascimento" class="form-label">Data de Nascimento</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                        <input type="date" name="data_nascimento" id="data_nascimento" class="form-control" value="<?= isset($usuario['data_nascimento']) ? esc($usuario['data_nascimento']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="telefone" class="form-label">Telefone</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-phone"></i></span>
                        <input type="text" name="telefone" id="telefone" class="form-control" value="<?= isset($usuario['telefone']) ? esc($usuario['telefone']) : '' ?>">
                    </div>
                </div>
            </div>

            <h5 class="mt-4 mb-3 border-bottom pb-2"><i class="fas fa-map-marker-alt me-2"></i>Endereço</h5>

            <div class="row g-3">
                <div class="col-md-3">
                    <label for="cep" class="form-label">CEP</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-map-pin"></i></span>
                        <input type="text" name="cep" id="cep" class="form-control" value="<?= isset($usuario['cep']) ? esc($usuario['cep']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-7">
                    <label for="logradouro" class="form-label">Logradouro</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-road"></i></span>
                        <input type="text" name="logradouro" id="logradouro" class="form-control" value="<?= isset($usuario['logradouro']) ? esc($usuario['logradouro']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-2">
                    <label for="numero" class="form-label">Número</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                        <input type="text" name="numero" id="numero" class="form-control" value="<?= isset($usuario['numero']) ? esc($usuario['numero']) : '' ?>">
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="bairro" class="form-label">Bairro</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-map"></i></span>
                        <input type="text" name="bairro" id="bairro" class="form-control" value="<?= isset($usuario['bairro']) ? esc($usuario['bairro']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-5">
                    <label for="cidade" class="form-label">Cidade</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-city"></i></span>
                        <input type="text" name="cidade" id="cidade" class="form-control" value="<?= isset($usuario['cidade']) ? esc($usuario['cidade']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-3">
                    <label for="estado" class="form-label">Estado</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-flag"></i></span>
                        <input type="text" name="estado" id="estado" class="form-control" value="<?= isset($usuario['estado']) ? esc($usuario['estado']) : '' ?>" maxlength="2">
                    </div>
                </div>
            </div>

            <div class="mt-4 text-end">
                <a href="<?= site_url('usuarios') ?>" class="btn btn-secondary me-2"><i class="fas fa-arrow-left me-1"></i> Voltar</a>
                <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> Salvar</button>
            </div>
        </form>
    </div>
</div>
<?= $this->endSection() ?>