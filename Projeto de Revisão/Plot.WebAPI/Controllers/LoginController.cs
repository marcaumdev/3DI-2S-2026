using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Plot.WebAPI.DTO;
using Plot.WebAPI.Interfaces;
using Plot.WebAPI.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Plot.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly JwtSettings _jwtSettings;

    public LoginController(IUsuarioRepository usuarioRepository, JwtSettings jwtSettings)
    {
        _usuarioRepository = usuarioRepository;
        _jwtSettings = jwtSettings;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Entrar([FromBody] LoginDTO dto)
    {
        var usuario = await _usuarioRepository.BuscarPorEmailESenha(dto.Email, dto.Senha);
        if (usuario is null || !usuario.Ativo) return Unauthorized();

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.IdUsuario.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.TipoUsuario),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var expiracao = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);
        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expiracao,
            signingCredentials: new SigningCredentials(chave, SecurityAlgorithms.HmacSha256)
            );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiracaoUtc = expiracao,
            usuario = UsuarioRespostaDTO.Converter(usuario)
        });
    }
}
