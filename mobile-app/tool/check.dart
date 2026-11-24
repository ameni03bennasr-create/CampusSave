// Outil de vérification locale (hors application) : analyse statique du projet.
// Utilisé parce que `dart analyze` / `flutter analyze` lancent un sous-processus
// (analysis_server) indisponible dans cet environnement d'exécution.
import 'dart:io';

import 'package:analyzer/dart/analysis/analysis_context_collection.dart';
import 'package:analyzer/dart/analysis/results.dart';
import 'package:analyzer/diagnostic/diagnostic.dart';
import 'package:path/path.dart' as p;

Future<void> main(List<String> args) async {
  final root = p.normalize(
    p.absolute(args.isEmpty ? Directory.current.path : args.first),
  );
  final collection = AnalysisContextCollection(includedPaths: [root]);
  var errors = 0;
  var warnings = 0;
  final files =
      Directory(p.join(root, 'lib'))
          .listSync(recursive: true)
          .whereType<File>()
          .where((f) => f.path.endsWith('.dart'))
          .map((f) => p.normalize(p.absolute(f.path)))
          .toList()
        ..sort();

  for (final path in files) {
    final context = collection.contextFor(path);
    final result = await context.currentSession.getResolvedUnit(path);
    if (result is! ResolvedUnitResult) {
      stdout.writeln('SKIP ${p.relative(path, from: root)}');
      continue;
    }
    for (final diagnostic in result.diagnostics) {
      final severity = diagnostic.severity;
      if (severity == Severity.error || severity == Severity.warning) {
        final loc = result.lineInfo.getLocation(diagnostic.offset);
        final tag = severity == Severity.error ? 'ERROR' : 'WARN ';
        stdout.writeln(
          '$tag ${p.relative(path, from: root)}:${loc.lineNumber}:'
          '${loc.columnNumber} ${diagnostic.diagnosticCode.lowerCaseName} '
          '${diagnostic.message}',
        );
        if (severity == Severity.error) {
          errors++;
        } else {
          warnings++;
        }
      }
    }
  }
  stdout.writeln('---');
  stdout.writeln(
    'files: ${files.length}  errors: $errors  warnings: $warnings',
  );
  exitCode = errors > 0 ? 1 : 0;
}
