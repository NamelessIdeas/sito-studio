# Derivate

La **derivata** di una funzione misura il tasso di variazione istantaneo.
È definita come limite del rapporto incrementale:

\[
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
\]

## Regole fondamentali

| Funzione \(f(x)\) | Derivata \(f'(x)\) |
| --- | --- |
| \(c\) (costante) | \(0\) |
| \(x^n\) | \(n\,x^{n-1}\) |
| \(\sin x\) | \(\cos x\) |
| \(\cos x\) | \(-\sin x\) |
| \(e^x\) | \(e^x\) |
| \(\ln x\) | \(\dfrac{1}{x}\) |

## Regole di composizione

- **Prodotto:** \((f g)' = f' g + f g'\)
- **Quoziente:** \(\left(\dfrac{f}{g}\right)' = \dfrac{f' g - f g'}{g^2}\)
- **Catena:** \(\big(f(g(x))\big)' = f'(g(x)) \cdot g'(x)\)

## Esempio

Data \(f(x) = x^3 + 2x\), applicando la regola della potenza:

\[
f'(x) = 3x^2 + 2
\]

!!! note "Interpretazione geometrica"
    \(f'(x_0)\) è il coefficiente angolare della retta tangente al grafico nel
    punto \((x_0, f(x_0))\).
