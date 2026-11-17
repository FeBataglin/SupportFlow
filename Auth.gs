function normalizeEmail_(value) { return String(value || '').trim().toLowerCase(); }

function validEmail_(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function allowedDomain_(email) {
  var domains = (PropertiesService.getScriptProperties().getProperty('ALLOWED_DOMAINS') || '')
    .split(',').map(function (d) { return d.trim().toLowerCase(); }).filter(Boolean);
  return domains.indexOf(email.split('@')[1]) >= 0;
}

function requireUser_(role) {
  var email = normalizeEmail_(Session.getActiveUser().getEmail());
  if (!email) throw new Error('Não foi possível identificar sua conta Google corporativa. Verifique a implantação com o administrador.');
  var configuredDomains = PropertiesService.getScriptProperties().getProperty('ALLOWED_DOMAINS');
  if (!configuredDomains || !configuredDomains.split(',').some(function (domain) { return domain.trim(); })) {
    throw new Error('Configuração inicial pendente: defina ALLOWED_DOMAINS nas Propriedades do script e execute setupSupportFlow pelo editor Apps Script.');
  }
  if (!allowedDomain_(email)) throw new Error('Acesso restrito: o domínio da conta conectada (' + email.split('@')[1] + ') não está autorizado em ALLOWED_DOMAINS. Verifique a conta Google utilizada ou solicite a configuração ao administrador.');
  var user = rows_('Users').filter(function (u) { return u.email === email && u.active === true; })[0];
  if (!user || ['admin', 'support'].indexOf(user.role) < 0) throw new Error('Sua conta não possui acesso ativo ao SupportFlow. Solicite o cadastro ao administrador.');
  if (role && user.role !== role) throw new Error('Esta operação exige perfil de administração.');
  return { email: email, role: user.role };
}
