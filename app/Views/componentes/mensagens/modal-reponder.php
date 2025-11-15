
<?php
// modal_responder.php

$cache = service('cache');

$responsaveisCache = $cache->get('responsaveis');

if ($responsaveisCache) {
    $users = $responsaveisCache;
} else{
    $users = model('ResponsavelModel')->getUsers();
    $cache->save('responsaveis', $users, 3600);
}

// Lógica para preenchimento automático
$reply_destinatario_id = $mensagem['remetente_id'] ?? '';
$reply_assunto = 'RE: ' . ($mensagem['assunto'] ?? 'Sem Assunto');
?>

<div class="modal fade" id="modalResponderMensagem" tabindex="-1" aria-labelledby="modalResponderMensagemLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="post" id="form_resposta_mensagem" name="form_resposta_mensagem" action="<?= site_url('mensagens/salvar') ?>">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalResponderMensagemLabel">
                        <i class="bi bi-reply-fill me-2"></i> Responder Mensagem
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <input type="hidden" name="id" value="">
                    
                    <div class="row mb-3">
                        <div class="form-group col-12">
                            <label for="destinatario_id" class="form-label fw-bold">Destinatário</label>
                            <select name="destinatario_id" class="form-control" required>
                                <option value="">Selecione um Destinatário</option>
                                <?php foreach ($users as $user): ?>
                                    <option value="<?= $user['id'] ?>" <?= ($reply_destinatario_id == $user['id']) ? 'selected' : '' ?>>
                                        <?= $user['username'] ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small class="text-muted">A mensagem será enviada para o usuário selecionado.</small>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="form-group col-12">
                            <label for="assunto" class="form-label fw-bold">Assunto</label>
                            <input type="text" class="form-control" name="assunto" id="assunto" value="<?= esc($reply_assunto) ?>" required>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="form-group col-12">
                            <label for="conteudo" class="form-label fw-bold">Conteúdo</label>
                            <textarea class="form-control" name="conteudo" id="conteudo" rows="8" placeholder="Escreva o conteúdo da sua resposta..."></textarea>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle me-1"></i> Fechar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-send-fill me-1"></i> Enviar Resposta
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
