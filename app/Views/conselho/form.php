<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card card-primary card-outline">
    <div class="card-header">
        <h3 class="card-title">
            <i class="fas fa-edit me-2"></i>
            <?= isset($conselho) ? 'Editar Conselho' : 'Novo Conselho' ?>
        </h3>
    </div>
    <div class="card-body">
        <form action="<?= isset($conselho) ? site_url('conselho/update/' . $conselho['id']) : site_url('conselho/create') ?>" method="post">
            <?php if (isset($conselho)): ?>
                <input type="hidden" name="_method" value="put">
            <?php endif; ?>

            <h5 class="mb-3 border-bottom pb-2"><i class="fas fa-info-circle me-2"></i>Dados Gerais</h5>

            <div class="row g-3">
                <div class="col-md-8">
                    <label for="nome" class="form-label">Nome</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-building"></i></span>
                        <input type="text" name="nome" id="nome" class="form-control" value="<?= isset($conselho) ? esc($conselho['nome']) : '' ?>" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="sigla" class="form-label">Sigla</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-tag"></i></span>
                        <input type="text" name="sigla" id="sigla" class="form-control" value="<?= isset($conselho) ? esc($conselho['sigla']) : '' ?>" required>
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                        <input type="email" name="email" id="email" class="form-control" value="<?= isset($conselho) ? esc($conselho['email']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="site" class="form-label">Site</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-globe"></i></span>
                        <input type="text" name="site" id="site" class="form-control" value="<?= isset($conselho) ? esc($conselho['site']) : '' ?>">
                    </div>
                </div>

                <div class="col-12">
                    <label for="sistema_profissoes" class="form-label">Sistema de Profissões</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-sitemap"></i></span>
                        <input type="text" name="sistema_profissoes" id="sistema_profissoes" class="form-control" value="<?= isset($conselho) ? esc($conselho['sistema_profissoes']) : '' ?>">
                    </div>
                </div>
            </div>

            <h5 class="mt-4 mb-3 border-bottom pb-2"><i class="fas fa-map-marker-alt me-2"></i>Endereço</h5>

            <div class="row g-3">
                <div class="col-md-3">
                    <label for="cep" class="form-label">CEP</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-map-pin"></i></span>
                        <input type="text" name="cep" id="cep" class="form-control" value="<?= isset($conselho) ? esc($conselho['cep']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-7">
                    <label for="logradouro" class="form-label">Logradouro</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-road"></i></span>
                        <input type="text" name="logradouro" id="logradouro" class="form-control" value="<?= isset($conselho) ? esc($conselho['logradouro']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-2">
                    <label for="numero" class="form-label">Número</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                        <input type="text" name="numero" id="numero" class="form-control" value="<?= isset($conselho) ? esc($conselho['numero']) : '' ?>">
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="bairro" class="form-label">Bairro</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-map"></i></span>
                        <input type="text" name="bairro" id="bairro" class="form-control" value="<?= isset($conselho) ? esc($conselho['bairro']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-5">
                    <label for="cidade" class="form-label">Cidade</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-city"></i></span>
                        <input type="text" name="cidade" id="cidade" class="form-control" value="<?= isset($conselho) ? esc($conselho['cidade']) : '' ?>">
                    </div>
                </div>
                <div class="col-md-3">
                    <label for="estado" class="form-label">Estado</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-flag"></i></span>
                        <input type="text" name="estado" id="estado" class="form-control" value="<?= isset($conselho) ? esc($conselho['estado']) : '' ?>" maxlength="2">
                    </div>
                </div>
            </div>

            <div class="mt-4 text-end">
                <a href="<?= site_url('conselho') ?>" class="btn btn-secondary me-2"><i class="fas fa-arrow-left me-1"></i> Voltar</a>
                <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> Salvar</button>
            </div>
        </form>
    </div>
</div>

<?php if (isset($conselho)): ?>
    <div class="card card-secondary card-outline mt-4">
        <div class="card-header">
            <h3 class="card-title"><i class="fas fa-briefcase me-2"></i>Profissões</h3>
        </div>
        <div class="card-body">
            <form action="<?= site_url('profissao/create') ?>" method="post" class="mb-4">
                <input type="hidden" name="conselho_id" value="<?= $conselho['id'] ?>">
                <div class="row g-3 align-items-end">
                    <div class="col-md-10">
                        <label for="nome_profissao" class="form-label">Nome da Profissão</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-user-tie"></i></span>
                            <input type="text" name="nome" id="nome_profissao" class="form-control" placeholder="Ex: Advogado, Médico..." required>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-success w-100"><i class="fas fa-plus me-1"></i> Adicionar</button>
                    </div>
                </div>
            </form>

            <div class="table-responsive">
                <table class="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($conselho['profissoes'])): ?>
                            <tr>
                                <td colspan="2" class="text-center text-muted">Nenhuma profissão cadastrada.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($conselho['profissoes'] as $profissao): ?>
                                <tr>
                                    <td><i class="fas fa-check-circle text-success me-2"></i><?= esc($profissao['nome']) ?></td>
                                    <td>
                                        <form action="<?= site_url('profissao/delete/' . $profissao['id']) ?>" method="post" class="d-inline" onsubmit="return confirm('Tem certeza que deseja excluir esta profissão?');">
                                            <input type="hidden" name="_method" value="delete">
                                            <button type="submit" class="btn btn-sm btn-danger" title="Excluir"><i class="fas fa-trash"></i></button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
<?php endif; ?>
<?= $this->endSection() ?>