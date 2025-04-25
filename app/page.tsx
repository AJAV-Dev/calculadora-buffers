"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BufferCalculator() {
  const [bufferType, setBufferType] = useState("phosphate")
  const [targetPH, setTargetPH] = useState(7.0)
  const [volume, setVolume] = useState(1.0)
  const [concentration, setConcentration] = useState(0.1)
  const [temperature, setTemperature] = useState(25)
  const [results, setResults] = useState(null)

  const bufferTypes = [
    { value: "phosphate", label: "Buffer de Fosfato" },
    { value: "tris", label: "Buffer Tris" },
    { value: "citrate", label: "Buffer de Citrato" },
    { value: "acetate", label: "Buffer de Acetato" },
    { value: "carbonate", label: "Buffer de Carbonato" },
  ]

  const calculateBuffer = () => {
    let result = {}

    switch (bufferType) {
      case "phosphate":
        result = calculatePhosphateBuffer(targetPH, volume, concentration, temperature)
        break
      case "tris":
        result = calculateTrisBuffer(targetPH, volume, concentration, temperature)
        break
      case "citrate":
        result = calculateCitrateBuffer(targetPH, volume, concentration, temperature)
        break
      case "acetate":
        result = calculateAcetateBuffer(targetPH, volume, concentration, temperature)
        break
      case "carbonate":
        result = calculateCarbonateBuffer(targetPH, volume, concentration, temperature)
        break
      default:
        result = { error: "Invalid buffer type" }
    }

    setResults(result)
  }

  const calculatePhosphateBuffer = (pH, volume, concentration, temperature) => {
    // Phosphate buffer calculation (Na2HPO4 and NaH2PO4)
    const pKa = 7.2 // pKa of phosphate buffer at 25°C

    // Henderson-Hasselbalch equation: pH = pKa + log([A-]/[HA])
    // [A-] = Na2HPO4 (basic form)
    // [HA] = NaH2PO4 (acidic form)

    const ratio = Math.pow(10, pH - pKa)
    const totalMoles = concentration * volume

    const molesBasic = (ratio * totalMoles) / (1 + ratio)
    const molesAcidic = totalMoles - molesBasic

    // Molecular weights
    const mwNa2HPO4 = 141.96 // g/mol
    const mwNaH2PO4 = 119.98 // g/mol

    const gramsBasic = molesBasic * mwNa2HPO4
    const gramsAcidic = molesAcidic * mwNaH2PO4

    return {
      components: [
        {
          name: "Na2HPO4 (fosfato de sodio dibásico)",
          amount: gramsBasic.toFixed(4),
          unit: "g",
        },
        {
          name: "NaH2PO4 (fosfato de sodio monobásico)",
          amount: gramsAcidic.toFixed(4),
          unit: "g",
        },
      ],
      finalVolume: volume,
      volumeUnit: "L",
      notes: "Disolver los componentes en agua destilada y ajustar al volumen final.",
    }
  }

  const calculateTrisBuffer = (pH, volume, concentration, temperature) => {
    // Tris buffer calculation (Tris base and Tris-HCl)
    // pKa of Tris is temperature dependent
    const pKa = 8.06 - 0.03 * (temperature - 25) // Approximate pKa adjustment for temperature

    const ratio = Math.pow(10, pH - pKa)
    const totalMoles = concentration * volume

    const molesBasic = (ratio * totalMoles) / (1 + ratio)
    const molesAcidic = totalMoles - molesBasic

    // Molecular weights
    const mwTrisBase = 121.14 // g/mol
    const mwTrisHCl = 157.6 // g/mol

    const gramsTrisBase = molesBasic * mwTrisBase
    const gramsTrisHCl = molesAcidic * mwTrisHCl

    return {
      components: [
        {
          name: "Tris base",
          amount: gramsTrisBase.toFixed(4),
          unit: "g",
        },
        {
          name: "Tris-HCl",
          amount: gramsTrisHCl.toFixed(4),
          unit: "g",
        },
      ],
      finalVolume: volume,
      volumeUnit: "L",
      notes:
        "Disolver los componentes en agua destilada y ajustar al volumen final. Alternativamente, usar Tris base y ajustar el pH con HCl.",
    }
  }

  const calculateCitrateBuffer = (pH, volume, concentration, temperature) => {
    // Citrate buffer calculation (Citric acid and Sodium citrate)
    const pKa = 4.76 // pKa of citric acid at 25°C

    const ratio = Math.pow(10, pH - pKa)
    const totalMoles = concentration * volume

    const molesSodiumCitrate = (ratio * totalMoles) / (1 + ratio)
    const molesCitricAcid = totalMoles - molesSodiumCitrate

    // Molecular weights
    const mwCitricAcid = 192.12 // g/mol (anhydrous)
    const mwSodiumCitrate = 258.07 // g/mol (dihydrate)

    const gramsCitricAcid = molesCitricAcid * mwCitricAcid
    const gramsSodiumCitrate = molesSodiumCitrate * mwSodiumCitrate

    return {
      components: [
        {
          name: "Ácido cítrico (anhidro)",
          amount: gramsCitricAcid.toFixed(4),
          unit: "g",
        },
        {
          name: "Citrato de sodio (dihidrato)",
          amount: gramsSodiumCitrate.toFixed(4),
          unit: "g",
        },
      ],
      finalVolume: volume,
      volumeUnit: "L",
      notes: "Disolver los componentes en agua destilada y ajustar al volumen final.",
    }
  }

  const calculateAcetateBuffer = (pH, volume, concentration, temperature) => {
    // Acetate buffer calculation (Acetic acid and Sodium acetate)
    const pKa = 4.76 // pKa of acetic acid at 25°C

    const ratio = Math.pow(10, pH - pKa)
    const totalMoles = concentration * volume

    const molesSodiumAcetate = (ratio * totalMoles) / (1 + ratio)
    const molesAceticAcid = totalMoles - molesSodiumAcetate

    // Molecular weights
    const mwAceticAcid = 60.05 // g/mol
    const mwSodiumAcetate = 82.03 // g/mol (anhydrous)

    // Acetic acid is typically available as a solution
    const aceticAcidConcentration = 17.4 // mol/L (glacial acetic acid)
    const mlAceticAcid = (molesAceticAcid / aceticAcidConcentration) * 1000

    const gramsSodiumAcetate = molesSodiumAcetate * mwSodiumAcetate

    return {
      components: [
        {
          name: "Ácido acético glacial",
          amount: mlAceticAcid.toFixed(4),
          unit: "mL",
        },
        {
          name: "Acetato de sodio (anhidro)",
          amount: gramsSodiumAcetate.toFixed(4),
          unit: "g",
        },
      ],
      finalVolume: volume,
      volumeUnit: "L",
      notes: "Disolver el acetato de sodio en agua, añadir ácido acético y ajustar al volumen final.",
    }
  }

  const calculateCarbonateBuffer = (pH, volume, concentration, temperature) => {
    // Carbonate buffer calculation (Sodium carbonate and Sodium bicarbonate)
    const pKa = 10.33 // pKa of bicarbonate at 25°C

    const ratio = Math.pow(10, pH - pKa)
    const totalMoles = concentration * volume

    const molesCarbonate = (ratio * totalMoles) / (1 + ratio)
    const molesBicarbonate = totalMoles - molesCarbonate

    // Molecular weights
    const mwCarbonate = 105.99 // g/mol (Na2CO3)
    const mwBicarbonate = 84.01 // g/mol (NaHCO3)

    const gramsCarbonate = molesCarbonate * mwCarbonate
    const gramsBicarbonate = molesBicarbonate * mwBicarbonate

    return {
      components: [
        {
          name: "Carbonato de sodio (Na2CO3)",
          amount: gramsCarbonate.toFixed(4),
          unit: "g",
        },
        {
          name: "Bicarbonato de sodio (NaHCO3)",
          amount: gramsBicarbonate.toFixed(4),
          unit: "g",
        },
      ],
      finalVolume: volume,
      volumeUnit: "L",
      notes: "Disolver los componentes en agua destilada y ajustar al volumen final.",
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Calculadora para la Preparación de Buffers</h1>

      <Card className="p-6 max-w-3xl mx-auto">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
            <TabsTrigger value="information">Más información</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="buffer-type">Tipo de Buffer</Label>
                <Select value={bufferType} onValueChange={setBufferType}>
                  <SelectTrigger id="buffer-type">
                    <SelectValue placeholder="Select buffer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bufferTypes.map((buffer) => (
                      <SelectItem key={buffer.value} value={buffer.value}>
                        {buffer.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-ph">pH Objetivo</Label>
                  <Input
                    id="target-ph"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={targetPH}
                    onChange={(e) => setTargetPH(Number.parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume">Volumen (L)</Label>
                  <Input
                    id="volume"
                    type="number"
                    step="0.1"
                    min="0.001"
                    value={volume}
                    onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concentration">Concentración (M)</Label>
                  <Input
                    id="concentration"
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={concentration}
                    onChange={(e) => setConcentration(Number.parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={temperature}
                    onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={calculateBuffer}>
                Calcular
              </Button>

              {results && (
                <div className="mt-6 p-4 border rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2">Resultados</h3>

                  <div className="space-y-4">
                    <p>
                      Para preparar {results.finalVolume} {results.volumeUnit} de buffer de {bufferType} a pH {targetPH}
                      :
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      {results.components.map((component, index) => (
                        <li key={index}>
                          {component.name}: {component.amount} {component.unit}
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm text-muted-foreground">{results.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="information">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Acerca de las Soluciones Buffer</h3>
              <p>
                Las soluciones buffer son soluciones acuosas que resisten cambios en el pH cuando se añaden pequeñas
                cantidades de ácido o base. Típicamente consisten en un ácido débil y su base conjugada, o una base
                débil y su ácido conjugado.
              </p>

              <h4 className="font-medium mt-4">Tipos Comunes de Buffer:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Buffer de Fosfato:</strong> Útil en el rango de pH 6.0-8.0, común en sistemas biológicos.
                </li>
                <li>
                  <strong>Buffer Tris:</strong> Útil en el rango de pH 7.0-9.0, ampliamente utilizado en bioquímica.
                </li>
                <li>
                  <strong>Buffer de Citrato:</strong> Útil en el rango de pH 3.0-6.2, usado en aplicaciones alimentarias
                  y farmacéuticas.
                </li>
                <li>
                  <strong>Buffer de Acetato:</strong> Útil en el rango de pH 3.6-5.6, común en aplicaciones bioquímicas.
                </li>
                <li>
                  <strong>Buffer de Carbonato:</strong> Útil en el rango de pH 9.2-10.8, usado en varias aplicaciones
                  industriales.
                </li>
              </ul>

              <h4 className="font-medium mt-4">Ecuación de Henderson-Hasselbalch:</h4>
              <p className="mt-2">
                Esta calculadora utiliza la ecuación de Henderson-Hasselbalch para determinar la proporción de
                componentes:
              </p>
              <div className="p-2 bg-muted rounded my-2 text-center">pH = pKa + log([A-]/[HA])</div>
              <p>Donde [A-] es la concentración de la base conjugada y [HA] es la concentración del ácido débil.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      <footer className="py-8 bg-background">
        <div className="container flex flex-col items-center justify-center gap-4">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            &copy; {new Date().getFullYear()} <a href="https://github.com/AJAV-Dev/calculadora-buffers" target="_blank" rel="noopener noreferrer"> Alvaro J. Avendaño</a>. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
