# Integrali

L'**integrale** è l'operazione inversa della derivata. L'integrale definito
rappresenta l'area sotto la curva tra due estremi:

\[
\int_a^b f(x)\,dx
\]

## Teorema fondamentale del calcolo

Se \(F\) è una primitiva di \(f\), cioè \(F'(x) = f(x)\), allora:

\[
\int_a^b f(x)\,dx = F(b) - F(a)
\]

## Integrali immediati

| Funzione \(f(x)\) | Primitiva \(\int f(x)\,dx\) |
| --- | --- |
| \(x^n\ (n \neq -1)\) | \(\dfrac{x^{n+1}}{n+1} + C\) |
| \(\dfrac{1}{x}\) | \(\ln\lvert x \rvert + C\) |
| \(e^x\) | \(e^x + C\) |
| \(\cos x\) | \(\sin x + C\) |
| \(\sin x\) | \(-\cos x + C\) |

## Esempio

\[
\int_0^1 x^2 \, dx = \left[ \frac{x^3}{3} \right]_0^1 = \frac{1}{3}
\]

!!! tip "Integrazione per parti"
    \[
    \int u \, dv = u v - \int v \, du
    \]
