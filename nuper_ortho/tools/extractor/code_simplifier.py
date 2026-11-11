import ast
from dataclasses import dataclass
from typing import List


@dataclass
class SimplificationNotice:
    rule: str
    line: int
    severity: str
    message: str
    suggestion: str


class PonytailCodeAuditor(ast.NodeVisitor):
    def __init__(self, filename: str = "<source>"):
        self.filename = filename
        self.notices: List[SimplificationNotice] = []
        self.defined_functions = set()
        self.called_functions = set()

    def visit_FunctionDef(self, node: ast.FunctionDef):
        self.defined_functions.add(node.name)

        if len(node.body) == 1 and isinstance(node.body[0], ast.Return):
            ret_val = node.body[0].value
            if isinstance(ret_val, ast.Call):
                target_func = ""
                if isinstance(ret_val.func, ast.Name):
                    target_func = ret_val.func.id
                elif isinstance(ret_val.func, ast.Attribute):
                    target_func = ret_val.func.attr
                if target_func:
                    self.notices.append(
                        SimplificationNotice(
                            rule="YAGNI_TRIVIAL_WRAPPER",
                            line=node.lineno,
                            severity="WARN",
                            message=f"'{node.name}' tek satırlık bir sarmalayıcı (wrapper) fonksiyondur.",
                            suggestion=f"'{target_func}' fonksiyonunu doğrudan çağırınız.",
                        )
                    )

        if len(node.body) > 120:
            self.notices.append(
                SimplificationNotice(
                    rule="PONYTAIL_HIGH_COMPLEXITY",
                    line=node.lineno,
                    severity="INFO",
                    message=f"'{node.name}' fonksiyonu {len(node.body)} satırdan uzundur.",
                    suggestion="Saf (pure) yardımcı fonksiyonlara bölünüz.",
                )
            )

        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        if isinstance(node.func, ast.Name):
            self.called_functions.add(node.func.id)
        self.generic_visit(node)

    def visit_Import(self, node: ast.Import):
        for alias in node.names:
            if alias.name in ("requests", "simplejson", "scipy"):
                self.notices.append(
                    SimplificationNotice(
                        rule="PONYTAIL_STDLIB_PREFERENCE",
                        line=node.lineno,
                        severity="WARN",
                        message=f"Harici kütüphane '{alias.name}' içe aktarıldı.",
                        suggestion="Standart kütüphane (urllib / json / math) tercih ediniz.",
                    )
                )
        self.generic_visit(node)


def audit_code_simplification(source_code: str, filename: str = "<source>") -> List[SimplificationNotice]:
    try:
        tree = ast.parse(source_code, filename=filename)
    except SyntaxError as e:
        return [
            SimplificationNotice(
                rule="SYNTAX_ERROR",
                line=e.lineno or 1,
                severity="ERROR",
                message=str(e),
                suggestion="Sözdizimi hatasını düzeltiniz.",
            )
        ]

    auditor = PonytailCodeAuditor(filename=filename)
    auditor.visit(tree)
    return auditor.notices
