using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Plot.WebAPI.Utils
{
    public class SwaggerAuthorizeOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var method = context.MethodInfo;

            var anonymous = method.IsDefined(typeof(AllowAnonymousAttribute), true)
                || (method.DeclaringType?.IsDefined(typeof(AllowAnonymousAttribute), true) ?? false);

            var authorized = method.IsDefined(typeof(AuthorizeAttribute), true)
                || (method.DeclaringType?.IsDefined(typeof(AuthorizeAttribute), true) ?? false);

            if (anonymous || !authorized) return;

            operation.Security ??= new List<OpenApiSecurityRequirement>();
            operation.Security.Add(new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", context.Document)] = new List<string>()
            });
        }
    }
}
